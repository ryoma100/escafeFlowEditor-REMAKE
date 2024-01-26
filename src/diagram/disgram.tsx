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
      moveActivity,
      resizeLeft,
      resizeRight,
    },
  } = useModel();

  const [offset, setOffset] = createSignal({ x: 0, y: 0 });
  const [size, setSize] = createSignal({ width: 0, height: 0 });

  type DragType = "none" | "scroll" | "addActivity";
  let dragType: DragType = "none";

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
    switch (toolbar()) {
      case "cursor":
        dragType = "scroll";
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
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

  function handleMouseMove(e: MouseEvent) {
    switch (dragType) {
      case "scroll":
        setOffset({
          x: offset().x - e.movementX / props.zoom,
          y: offset().y - e.movementY / props.zoom,
        });
        break;
    }
  }

  function handleMouseUp() {
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
        <For each={activityList}>
          {(activity) => <ActivityNode id={activity.id} zoom={props.zoom} />}
        </For>
      </svg>
    </div>
  );
}
