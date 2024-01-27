import { For, createSignal, onMount } from "solid-js";
import "./diagram.css";
import { useOperation } from "../context/operation-context";
import { useModel } from "../context/model-context";
import { ActivityNode } from "./activity-node";

export function Diagram(props: { zoom: number }) {
  const {
    toolbar: { toolbar },
  } = useOperation();
  const {
    activity: {
      activityList,
      addActivity,
      moveSelectedActivities,
      layerTopActivity,
      selectActivities,
    },
  } = useModel();

  const [offset, setOffset] = createSignal({ x: 0, y: 0 });
  const [size, setSize] = createSignal({ width: 0, height: 0 });

  type DragType = "none" | "scroll" | "addActivity";
  let dragType: DragType = "none";
  let addActivityId: number = 0;

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
          offset().x + e.offsetX / props.zoom,
          offset().y + e.offsetY / props.zoom
        );
        layerTopActivity(addActivityId);
        selectActivities([addActivityId]);
        break;
    }
  }

  function handleMouseMove(e: MouseEvent) {
    const moveX = e.movementX / props.zoom;
    const moveY = e.movementY / props.zoom;

    switch (dragType) {
      case "scroll":
        setOffset({
          x: offset().x - moveX,
          y: offset().y - moveY,
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

  let svg: SVGSVGElement | undefined;
  return (
    <div class="diagram">
      <svg
        ref={svg}
        width={size().width}
        height={size().height}
        viewBox={`${offset().x} ${offset().y} ${size().width / props.zoom} ${size().height / props.zoom}`}
        onMouseDown={handleMouseDown}
      >
        <g data-id="activities">
          <For each={activityList}>
            {(activity) => <ActivityNode id={activity.id} zoom={props.zoom} />}
          </For>
        </g>
      </svg>
    </div>
  );
}
