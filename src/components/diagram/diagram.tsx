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

export type DragType =
  | "none"
  | "scroll"
  | "addActivity"
  | "moveNodes"
  | "resizeActivityLeft"
  | "resizeActivityRight"
  | "addTransition"
  | "addCommentNode"
  | "addCommentEdge"
  | "addStartNode"
  | "addStartEdge"
  | "addEndNode"
  | "addEndEdge";

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
    diagram: {
      svgRect,
      setSvgRect,
      viewBox,
      setViewBox,
      toolbar,
      zoom,
      dragType,
      setDragType,
      addingLine,
      setAddingLineTo,
    },
  } = useAppContext();

  onMount(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });

  createEffect(() => {
    setViewBox({
      width: svgRect.width / zoom(),
      height: svgRect.height / zoom(),
    });
  });

  function handleMouseDown(e: MouseEvent) {
    if (dragType() === "none") {
      const x = viewBox.x + (e.clientX - svgRect.x) / zoom();
      const y = viewBox.y + (e.clientY - svgRect.y) / zoom();

      switch (toolbar()) {
        case "cursor":
          changeSelectNodes("clearAll");
          changeSelectEdges("clearAll");
          setDragType("scroll");
          return;
        case "addManualActivity":
          {
            const activity = addActivity("manualActivity", selectedActor().id, x, y);
            changeTopLayer(activity.id);
            changeSelectNodes("select", [activity.id]);
            setDragType("addActivity");
          }
          return;
        case "addAutoActivity":
          {
            const activity = addActivity("autoActivity", selectedActor().id, x, y);
            changeTopLayer(activity.id);
            changeSelectNodes("select", [activity.id]);
            setDragType("addActivity");
          }
          return;
        case "addUserActivity":
          {
            const activity = addActivity("userActivity", selectedActor().id, x, y);
            changeTopLayer(activity.id);
            changeSelectNodes("select", [activity.id]);
            setDragType("addActivity");
          }
          return;
        case "addCommentNode":
          {
            const comment = addCommentNode(x, y);
            changeSelectNodes("select", [comment.id]);
            setDragType("addCommentNode");
          }
          return;
        case "addStartNode":
          {
            const startNode = addStartNode(x, y);
            changeSelectNodes("select", [startNode.id]);
            setDragType("addStartNode");
          }
          return;
        case "addEndNode":
          {
            const endNode = addEndNode(x, y);
            changeSelectNodes("select", [endNode.id]);
            setDragType("addEndNode");
          }
          return;
      }
    }
  }

  function handleMouseMove(e: MouseEvent) {
    const moveX = e.movementX / zoom();
    const moveY = e.movementY / zoom();

    switch (dragType()) {
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

  function handleMouseUp() {
    setDragType("none");
  }

  return (
    <DiagramView
      viewBox={viewBox}
      svgRect={svgRect}
      setSvgRect={setSvgRect}
      addingLine={
        dragType() === "addTransition" ||
        dragType() === "addStartEdge" ||
        dragType() === "addEndEdge" ||
        dragType() === "addCommentEdge"
          ? addingLine()
          : null
      }
      nodeList={nodeList}
      edgeList={edgeList}
      onMouseDown={handleMouseDown}
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
    <div class="relative h-full w-full" ref={diagramRef}>
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
