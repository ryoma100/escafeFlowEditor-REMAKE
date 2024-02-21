import { For, JSXElement, Show, createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { defaultRectangle } from "../../constants/app-const";
import { useAppContext } from "../../context/app-context";
import { ActivityNodeContainer } from "./activity-node";
import "./diagram.css";
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
    activityModel: {
      activityList,
      addActivity,
      moveSelectedActivities,
      layerTopActivity,
      selectActivities,
      resizeLeft,
      resizeRight,
    },
    transitionModel: { transitionList, selectTransitions },
    otherNodeModel: {
      otherNodeList,
      addCommentNode,
      selectNodes,
      moveSelectedNodes,
      addStartNode,
      addEndNode,
    },
    otherEdgeModel: { otherEdgeList, selectOtherEdges },
    diagram: { toolbar, zoom, dragType, setDragType, addingLine, setAddingLineTo },
  } = useAppContext();

  const [svgRect, setRect] = createStore({ ...defaultRectangle });
  const [viewBox, setViewBox] = createStore({ ...defaultRectangle });

  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (diagram) {
        const rect = diagram.getBoundingClientRect();
        setRect({
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
            selectActivities([]);
            selectNodes([]);
            selectTransitions([]);
            selectOtherEdges([]);
            setDragType("scroll");
            break;
          case "addManualActivity":
            {
              const activity = addActivity(
                "manualActivity",
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              layerTopActivity(activity.id);
              selectActivities([activity.id]);
              setDragType("addActivity");
            }
            break;
          case "addAutoActivity":
            {
              const activity = addActivity(
                "autoActivity",
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              layerTopActivity(activity.id);
              selectActivities([activity.id]);
              setDragType("addActivity");
            }
            break;
          case "addUserActivity":
            {
              const activity = addActivity(
                "userActivity",
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              layerTopActivity(activity.id);
              selectActivities([activity.id]);
              setDragType("addActivity");
            }
            break;
          case "addCommentNode":
            {
              const comment = addCommentNode(
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              selectNodes([comment.id]);
              setDragType("addCommentNode");
            }
            break;
          case "addStartNode":
            {
              const startEnd = addStartNode(
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              selectNodes([startEnd.id]);
              setDragType("addStartNode");
            }
            break;
          case "addEndNode":
            {
              const startEnd = addEndNode(
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              selectNodes([startEnd.id]);
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
        moveSelectedActivities(moveX, moveY);
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
    <div class="diagram" ref={diagram}>
      <svg
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
              class="adding-line"
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
