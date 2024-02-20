import { For, JSXElement, Show, createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ActivityNodeContainer } from "./activity-node";
import "./diagram.css";
import { OtherEdgeContainer } from "./other-edge";
import { OtherNodeContainer } from "./other-node";
import { TransitionEdgeView } from "./transition-edge";

export type DragType =
  | "none"
  | "scroll"
  | "addActivity"
  | "moveNodes"
  | "resizeActivityLeft"
  | "resizeActivityRight"
  | "addTransition"
  | "addComment"
  | "addStartEnd"
  | "addCommentEdge"
  | "addStartEdge"
  | "addEndEdge";

export function Diagram(): JSXElement {
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
    transitionModel: { transitionList },
    otherNodeModel: {
      otherNodeList,
      addCommentNode,
      selectNodes,
      moveSelectedNodes,
      addStartNode,
      addEndNode,
    },
    otherEdgeModel: { otherEdgeList },
    diagram: { toolbar, zoom, dragType, setDragType, addingLine, setAddingLineTo },
  } = useAppContext();

  const [svgRect, setRect] = createStore({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [viewBox, setViewBox] = createStore({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

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
            setDragType("scroll");
            break;
          case "manual":
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
          case "comment":
            {
              const comment = addCommentNode(
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              selectNodes([comment.id]);
              setDragType("addComment");
            }
            break;
          case "start":
            {
              const startEnd = addStartNode(
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              selectNodes([startEnd.id]);
              setDragType("addStartEnd");
            }
            break;
          case "end":
            {
              const startEnd = addEndNode(
                viewBox.x + (e.clientX - svgRect.x) / zoom(),
                viewBox.y + (e.clientY - svgRect.y) / zoom(),
              );
              selectNodes([startEnd.id]);
              setDragType("addStartEnd");
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
      case "addComment":
      case "addStartEnd":
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
          <For each={activityList}>
            {(activity) => <ActivityNodeContainer activity={activity} />}
          </For>
        </g>
        <g data-id="no-activity-nodes">
          <For each={otherNodeList}>{(node) => <OtherNodeContainer node={node} />}</For>
        </g>
        <g data-id="transition-edges">
          <For each={transitionList}>
            {(transition) => <TransitionEdgeView transition={transition} />}
          </For>
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
