import { For, Show, createEffect, onMount } from "solid-js";
import "./diagram.css";
import { useModel } from "../context/model-context";
import { ActivityNode } from "./activity-node";
import { createStore } from "solid-js/store";
import { useDiagram } from "../context/diagram-context";
import { TransitionEdge } from "./transition-edge";

export type DragType =
  | "none"
  | "scroll"
  | "addActivity"
  | "moveActivities"
  | "resizeActivityLeft"
  | "resizeActivityRight"
  | "addTransition";

export function Diagram() {
  const {
    toolbar: { toolbar },
    diagram: { zoom, dragType, setDragType, addingLine, setAddingLine },
  } = useDiagram();
  const {
    activity: {
      activityList,
      addActivity,
      moveSelectedActivities,
      layerTopActivity,
      selectActivities,
      resizeLeft,
      resizeRight,
    },
    transition: { transitionList },
  } = useModel();

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

  let addActivityId: number = 0;

  onMount(() => {
    const observer = new ResizeObserver(() => {
      const rect = diagram?.getBoundingClientRect();
      setRect({
        x: rect?.left ?? 0,
        y: rect?.top ?? 0,
        width: rect?.width ?? 0,
        height: rect?.height ?? 0,
      });
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
            setDragType("scroll");
            break;
          case "manual":
            addActivityId = addActivity(
              "manual",
              viewBox.x + (e.clientX - svgRect.x) / zoom(),
              viewBox.y + (e.clientY - svgRect.y) / zoom()
            );
            layerTopActivity(addActivityId);
            selectActivities([addActivityId]);
            setDragType("addActivity");
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
        moveSelectedActivities(moveX, moveY);
        break;
      case "moveActivities":
        moveSelectedActivities(moveX, moveY);
        break;
      case "resizeActivityLeft":
        resizeLeft(moveX);
        break;
      case "resizeActivityRight":
        resizeRight(moveX);
        break;
      case "addTransition":
        setAddingLine({
          fromX: addingLine().fromX,
          fromY: addingLine().fromY,
          toX: viewBox.x + (e.clientX - svgRect.x) / zoom(),
          toY: viewBox.y + (e.clientY - svgRect.y) / zoom(),
        });
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
            refX="5"
            refY="0"
            orient="auto"
            markerWidth="10"
            markerHeight="10"
          >
            <polygon points="10,0 0,5 0,-5" fill="gray" />
          </marker>
        </defs>
        <g data-id="activities">
          <For each={activityList}>{(it) => <ActivityNode id={it.id} />}</For>
        </g>
        <g data-id="transitions">
          <For each={transitionList}>
            {(it) => <TransitionEdge id={it.id} />}
          </For>
        </g>
        <g data-id="adding-line">
          <Show when={dragType() === "addTransition"}>
            <line
              class="adding-line"
              x1={addingLine().fromX}
              y1={addingLine().fromY}
              // SVG does not propagate events. Adjust positision +8 to dispatch onMouseUp event in Activity.
              x2={addingLine().toX + 8}
              y2={addingLine().toY + 8}
            />
          </Show>
        </g>
      </svg>
    </div>
  );
}
