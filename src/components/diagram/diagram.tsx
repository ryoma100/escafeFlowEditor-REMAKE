import { For, JSXElement, Show, createEffect, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import {
  ActivityNode,
  CommentEdge,
  CommentNode,
  EndEdge,
  EndNode,
  IEdge,
  INode,
  Line,
  Rectangle,
  StartEdge,
  StartNode,
  TransitionEdge,
} from "../../data-source/data-type";
import { ActivityNodeContainer } from "./activity-node";
import { ExtendEdgeContainer } from "./extend-edge";
import { ExtendNodeContainer } from "./extend-node";
import { TransitionEdgeContainer } from "./transition-edge";

export function DiagramContainer(): JSXElement {
  const {
    activityNodeModel: { addActivity, resizeLeft, resizeRight },
    actorModel: { selectedActor },
    extendNodeModel: { addCommentNode, addStartNode, addEndNode },
    nodeModel: {
      changeSelectNodes,
      moveSelectedNodesPosition: moveSelectedNodes,
      changeTopLayer,
      nodeList,
    },
    edgeModel: { changeSelectEdges, edgeList },
    diagramModel: {
      svgRect,
      setSvgRect,
      viewBox,
      setViewBox,
      toolbar,
      setToolbar,
      zoom,
      dragType,
      setDragType,
      addingLine,
      setAddingLineTo,
    },
  } = useAppContext();

  onMount(() => {
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
  });

  createEffect(() => {
    setViewBox({
      width: svgRect.width / zoom(),
      height: svgRect.height / zoom(),
    });
  });

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();

    if (dragType().type === "none") {
      const x = viewBox.x + (e.clientX - svgRect.x) / zoom();
      const y = viewBox.y + (e.clientY - svgRect.y) / zoom();
      switch (toolbar()) {
        case "cursor":
          changeSelectNodes("clearAll");
          changeSelectEdges("clearAll");
          setDragType({ type: "scroll" });
          return;
        case "transition":
          return;
        case "addManualActivity":
          {
            const activity = addActivity("manualActivity", selectedActor().id, x, y);
            changeTopLayer(activity.id);
            changeSelectNodes("select", [activity.id]);
            setDragType({ type: "addActivity" });
          }
          return;
        case "addAutoActivity":
          {
            const activity = addActivity("autoActivity", selectedActor().id, x, y);
            changeTopLayer(activity.id);
            changeSelectNodes("select", [activity.id]);
            setDragType({ type: "addActivity" });
          }
          return;
        case "addUserActivity":
          {
            const activity = addActivity("userActivity", selectedActor().id, x, y);
            changeTopLayer(activity.id);
            changeSelectNodes("select", [activity.id]);
            setDragType({ type: "addActivity" });
          }
          return;
        case "addCommentNode":
          {
            const comment = addCommentNode(x, y);
            changeSelectNodes("select", [comment.id]);
            setDragType({ type: "addCommentNode" });
          }
          return;
        case "addStartNode":
          {
            const startNode = addStartNode(x, y);
            changeSelectNodes("select", [startNode.id]);
            setDragType({ type: "addStartNode" });
          }
          return;
        case "addEndNode":
          {
            const endNode = addEndNode(x, y);
            changeSelectNodes("select", [endNode.id]);
            setDragType({ type: "addEndNode" });
          }
          return;
      }
    }
  }

  function handleDocumentMouseMove(e: MouseEvent) {
    const moveX = e.movementX / zoom();
    const moveY = e.movementY / zoom();

    switch (dragType().type) {
      case "scroll":
        setViewBox({
          x: viewBox.x - moveX,
          y: viewBox.y - moveY,
        });
        return;
      case "addActivity":
      case "addCommentNode":
      case "addStartNode":
      case "addEndNode":
      case "moveNodes":
        moveSelectedNodes(moveX, moveY);
        return;
      case "resizeActivityLeft":
        resizeLeft(moveX);
        return;
      case "resizeActivityRight":
        resizeRight(moveX);
        return;
      case "addTransition":
      case "addCommentEdge":
      case "addStartEdge":
        setAddingLineTo(
          viewBox.x + (e.clientX - svgRect.x) / zoom(),
          viewBox.y + (e.clientY - svgRect.y) / zoom(),
        );
        return;
    }
  }

  function handleDocumentMouseUp() {
    setDragType({ type: "none" });
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      setToolbar("cursor");
    }
  }

  return (
    <DiagramView
      viewBox={viewBox}
      svgRect={svgRect}
      setSvgRect={setSvgRect}
      addingLine={
        dragType().type === "addTransition" ||
        dragType().type === "addStartEdge" ||
        dragType().type === "addEndEdge" ||
        dragType().type === "addCommentEdge"
          ? addingLine()
          : null
      }
      nodeList={nodeList}
      edgeList={edgeList}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    />
  );
}

export function DiagramView(props: {
  viewBox: Rectangle;
  svgRect: Rectangle;
  addingLine: Line | null;
  nodeList: INode[];
  edgeList: IEdge[];
  setSvgRect: (rect: Rectangle) => void;
  onMouseDown: (e: MouseEvent) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}) {
  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (diagramRef) {
        const rect = diagramRef.getBoundingClientRect();
        props.setSvgRect({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    });
    if (diagramRef) {
      observer.observe(diagramRef);
    }
  });

  let diagramRef: HTMLDivElement | undefined;
  return (
    <div
      class="relative h-full w-full outline-none"
      ref={diagramRef}
      tabindex={-1}
      onKeyDown={(e) => props.onKeyDown(e)}
    >
      <svg
        class="absolute inset-0 h-full w-full"
        width={props.svgRect.width}
        height={props.svgRect.height}
        viewBox={`${props.viewBox.x} ${props.viewBox.y} ${props.viewBox.width} ${props.viewBox.height}`}
        onMouseDown={(e) => props.onMouseDown(e)}
      >
        <defs>
          <marker
            id="arrow-end"
            viewBox="0 0 40 20"
            refX="40"
            refY="10"
            orient="auto"
            markerWidth="20"
            markerHeight="20"
          >
            <polygon points="20,0 40,10 20,20" fill="gray" />
          </marker>
          <marker
            id="ognl-arrow-end"
            viewBox="0 0 40 20"
            refX="40"
            refY="10"
            markerUnits="strokeWidth"
            orient="auto"
            markerWidth="20"
            markerHeight="20"
          >
            <polygon points="5,0 5,20, 8,20 8,0" fill="gray" />
            <polygon points="12,0 12,20, 15,20 15,0" fill="gray" />
            <polygon points="20,0 40,10 20,20" fill="gray" />
          </marker>
        </defs>
        <g data-id="extend-edges">
          <For each={props.edgeList.filter((it) => it.type !== "transitionEdge")}>
            {(it) => <ExtendEdgeContainer edge={it as StartEdge | EndEdge | CommentEdge} />}
          </For>
        </g>
        <g data-id="activity-nodes">
          <For each={props.nodeList.filter((it) => it.type === "activityNode")}>
            {(it) => <ActivityNodeContainer activity={it as ActivityNode} />}
          </For>
        </g>
        <g data-id="extend-nodes">
          <For each={props.nodeList.filter((it) => it.type !== "activityNode")}>
            {(it) => <ExtendNodeContainer node={it as StartNode | EndNode | CommentNode} />}
          </For>
        </g>
        <g data-id="transition-edges">
          <For each={props.edgeList.filter((it) => it.type === "transitionEdge")}>
            {(it) => <TransitionEdgeContainer transition={it as TransitionEdge} />}
          </For>
        </g>

        <g data-id="adding-line">
          <Show when={props.addingLine != null}>
            <line
              class="pointer-events-none fill-none stroke-black stroke-2"
              x1={props.addingLine?.p1.x}
              y1={props.addingLine?.p1.y}
              x2={props.addingLine?.p2.x}
              y2={props.addingLine?.p2.y}
            />
          </Show>
        </g>
      </svg>
    </div>
  );
}
