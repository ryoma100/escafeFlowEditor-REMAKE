import { For, createSignal, onMount } from "solid-js";
import "./diagram.css";
import { useOperation } from "../context/operation-context";
import { useModel } from "../context/model-context";

export function Diagram(props: { zoom: number }) {
  const {
    toolbar: { toolbar },
  } = useOperation();
  const {
    activity: {
      activityList,
      addActivity,
      moveActivity,
      resizeLeft,
      resizeRight,
    },
  } = useModel();

  const [isDragging, setIsDragging] = createSignal<boolean>(false);
  const [offset, setOffset] = createSignal({ x: 0, y: 0 });
  const [size, setSize] = createSignal({ width: 0, height: 0 });

  const [dragTarget, setDragTarget] = createSignal<{
    target: "activity" | "screen" | "activity-left" | "activity-right";
    id: string;
  }>({ target: "screen", id: "" });

  function handleDiagramMouseDown(e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        setDragTarget({ target: "screen", id: "" });
        setIsDragging(true);
        break;
      case "manual":
        addActivity(
          "manual",
          offset().x + e.offsetX / props.zoom,
          offset().y + e.offsetY / props.zoom
        );
        break;
    }
  }

  onMount(() => {
    const observer = new ResizeObserver(() => {
      setSize({
        width: svg?.clientWidth ?? 0,
        height: svg?.clientHeight ?? 0,
      });
    });
    if (svg) {
      observer.observe(svg);
    }

    document.addEventListener("mousemove", handleDiagramMouseMove);
    document.addEventListener("mouseup", handleDiagramMouseUp);
  });

  function handleDiagramMouseMove(e: MouseEvent) {
    if (!isDragging()) return;

    switch (dragTarget().target) {
      case "screen":
        setOffset({
          x: offset().x - e.movementX / props.zoom,
          y: offset().y - e.movementY / props.zoom,
        });
        break;
      case "activity":
        moveActivity(
          dragTarget().id,
          e.movementX / props.zoom,
          e.movementY / props.zoom
        );
        break;
      case "activity-left":
        resizeLeft(dragTarget().id, e.movementX / props.zoom);
        break;
      case "activity-right":
        resizeRight(dragTarget().id, e.movementX / props.zoom);
        break;
    }
  }

  function handleDiagramMouseUp() {
    setIsDragging(false);
  }

  function handleActivityMouseDown(actId: string, e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        e.stopPropagation();
        setDragTarget({ target: "activity", id: actId });
        setIsDragging(true);
        break;
    }
  }

  function handleActivityLeftMouseDown(actId: string, e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        e.stopPropagation();
        setDragTarget({ target: "activity-left", id: actId });
        setIsDragging(true);
        break;
    }
  }

  function handleActivityRightMouseDown(actId: string, e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        e.stopPropagation();
        setDragTarget({ target: "activity-right", id: actId });
        setIsDragging(true);
        break;
    }
  }

  let svg: SVGSVGElement | undefined;
  return (
    <div class="diagram">
      <svg
        ref={svg}
        width={size().width}
        height={size().height}
        viewBox={`${offset().x} ${offset().y} ${size().width / props.zoom} ${size().height / props.zoom}`}
        onMouseDown={handleDiagramMouseDown}
      >
        <For each={activityList}>
          {(activity) => (
            <g>
              <rect
                x={activity.x - activity.width / 2 - 10}
                y={activity.y - 51}
                width={10}
                height={activity.height + 2}
                class="actor-select"
                onMouseDown={[handleActivityLeftMouseDown, activity.id]}
              />
              <rect
                x={activity.x + activity.width / 2}
                y={activity.y - 51}
                width={10}
                height={activity.height + 2}
                class="actor-select"
                onMouseDown={[handleActivityRightMouseDown, activity.id]}
              />
              <rect
                x={activity.x - activity.width / 2}
                y={activity.y - activity.height / 2}
                width={activity.width}
                height={activity.height}
                onMouseDown={[handleActivityMouseDown, activity.id]}
                class="actor"
              />
              <text color="blue" x={activity.x} y={activity.y}>
                {activity.id}
              </text>
            </g>
          )}
        </For>
      </svg>
    </div>
  );
}
