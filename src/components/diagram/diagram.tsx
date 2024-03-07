import { For, JSXElement, Show, createEffect, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { ActivityNodeContainer } from "./activity-node";
import { OtherEdgeContainer } from "./other-edge";
import { OtherNodeContainer } from "./other-node";
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
    activityModel: { activityList, addActivity, layerTopActivity, resizeLeft, resizeRight },
    actorModel: { selectedActor },
    transitionModel: { transitionList },
    otherNodeModel: { otherNodeList, addCommentNode, addStartNode, addEndNode },
    otherEdgeModel: { otherEdgeList },
    baseNodeModel: { changeSelectNodes, moveSelectedNodes },
    baseEdgeModel: { changeSelectEdges },
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
    const observer = new ResizeObserver(() => {
      if (diagram) {
        const rect = diagram.getBoundingClientRect();
        setSvgRect({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    });
    if (diagram) {
      observer.observe(diagram);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });

  function handleMouseDown(e: MouseEvent) {
    switch (dragType()) {
      case "none":
        switch (toolbar()) {
          case "cursor":
            changeSelectNodes("clearAll");
            changeSelectEdges("clearAll");
            setDragType("scroll");
            break;
          case "addManualActivity":
            {
              const activity = addActivity(
                "manualActivity",
                selectedActor().id,
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              layerTopActivity(activity.id);
              changeSelectNodes("select", [activity.id]);
              setDragType("addActivity");
            }
            break;
          case "addAutoActivity":
            {
              const activity = addActivity(
                "autoActivity",
                selectedActor().id,
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              layerTopActivity(activity.id);
              changeSelectNodes("select", [activity.id]);
              setDragType("addActivity");
            }
            break;
          case "addUserActivity":
            {
              const activity = addActivity(
                "userActivity",
                selectedActor().id,
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              layerTopActivity(activity.id);
              changeSelectNodes("select", [activity.id]);
              setDragType("addActivity");
            }
            break;
          case "addCommentNode":
            {
              const comment = addCommentNode(
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              changeSelectNodes("select", [comment.id]);
              setDragType("addCommentNode");
            }
            break;
          case "addStartNode":
            {
              const startEnd = addStartNode(
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              changeSelectNodes("select", [startEnd.id]);
              setDragType("addStartNode");
            }
            break;
          case "addEndNode":
            {
              const startEnd = addEndNode(
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              changeSelectNodes("select", [startEnd.id]);
              setDragType("addEndNode");
            }
            break;
        }
        break;
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
        break;
      case "addActivity":
      case "addCommentNode":
      case "addStartNode":
      case "addEndNode":
      case "moveNodes":
        moveSelectedNodes(moveX, moveY);
        break;
      case "resizeActivityLeft":
        resizeLeft(moveX);
        break;
      case "resizeActivityRight":
        resizeRight(moveX);
        break;
      case "addTransition":
      case "addCommentEdge":
      case "addStartEdge":
        setAddingLineTo(
          viewBox.x + (e.clientX - svgRect.x) / zoom(),
          viewBox.y + (e.clientY - svgRect.y) / zoom(),
        );
        break;
    }
  }

  function handleMouseUp() {
    setDragType("none");
  }

  createEffect(() => {
    setViewBox({
      width: svgRect.width / zoom(),
      height: svgRect.height / zoom(),
    });
  });

  let diagram: HTMLDivElement | undefined;
  return (
    <div class="relative h-full w-full" ref={diagram}>
      <svg
        class="absolute inset-0 h-full w-full"
        width={svgRect.width}
        height={svgRect.height}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        onMouseDown={handleMouseDown}
      >
        <defs>
          <marker
            id="arrow-end"
            viewBox="0 -5 10 10"
            refX="10"
            refY="0"
            orient="auto"
            markerWidth="15"
            markerHeight="15"
          >
            <polygon points="10,0 0,5 0,-5" fill="gray" />
          </marker>
        </defs>
        <g data-id="no-activity-edges">
          <For each={otherEdgeList}>{(it) => <OtherEdgeContainer edge={it} />}</For>
        </g>
        <g data-id="activity-nodes">
          <For each={activityList}>{(it) => <ActivityNodeContainer activity={it} />}</For>
        </g>
        <g data-id="no-activity-nodes">
          <For each={otherNodeList}>{(it) => <OtherNodeContainer node={it} />}</For>
        </g>
        <g data-id="transition-edges">
          <For each={transitionList}>{(it) => <TransitionEdgeContainer transition={it} />}</For>
        </g>
        <g data-id="adding-line">
          <Show
            when={
              dragType() === "addTransition" ||
              dragType() === "addCommentEdge" ||
              dragType() === "addStartEdge" ||
              dragType() === "addEndEdge"
            }
          >
            <line
              class="pointer-events-none fill-none stroke-black stroke-2"
              x1={addingLine().fromX}
              y1={addingLine().fromY}
              x2={addingLine().toX}
              y2={addingLine().toY}
            />
          </Show>
        </g>
      </svg>
    </div>
  );
}
