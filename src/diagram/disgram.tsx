import { For, createEffect, onMount } from "solid-js";
import "./diagram.css";
import { useModel } from "../context/model-context";
import { ActivityNode } from "./activity-node";
import { createStore } from "solid-js/store";
import { useDiagram } from "../context/diagram-context";

export type DragType =
  | "none"
  | "scroll"
  | "addActivity"
  | "moveActivity"
  | "resizeActivityLeft"
  | "resizeActivityRight";

export function Diagram() {
  const {
    toolbar: { toolbar },
    diagram: { zoom },
  } = useDiagram();
  const {
    activity: {
      activityList,
      addActivity,
      moveSelectedActivities,
      layerTopActivity,
      selectActivities,
    },
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

  let dragType: DragType = "none";
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
  });

  function handleMouseDown(e: MouseEvent) {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    switch (toolbar()) {
      case "cursor":
        dragType = "scroll";
        selectActivities([]);
        break;
      case "manual":
        dragType = "addActivity";
        addActivityId = addActivity(
          "manual",
          viewBox.x + (e.clientX - svgRect.x) / zoom(),
          viewBox.y + (e.clientY - svgRect.y) / zoom()
        );
        layerTopActivity(addActivityId);
        selectActivities([addActivityId]);
        break;
    }
  }

  function handleMouseMove(e: MouseEvent) {
    const moveX = e.movementX / zoom();
    const moveY = e.movementY / zoom();

    switch (dragType) {
      case "scroll":
        setViewBox({
          x: viewBox.x - moveX,
          y: viewBox.y - moveY,
        });
        break;
      case "addActivity":
        moveSelectedActivities(moveX, moveY);
        break;
    }
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    dragType = "none";
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
        <g data-id="activities">
          <For each={activityList}>
            {(activity) => <ActivityNode id={activity.id} />}
          </For>
        </g>
      </svg>
    </div>
  );
}
