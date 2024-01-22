import { For, createSignal, onMount } from "solid-js";
import { produce } from "solid-js/store";
import "./diagram.css";
import { useOperation } from "../context/operation-context";
import { useModel } from "../context/model-context";

export function Diagram(props: { zoom: number }) {
  const {
    toolbar: { toolbar },
  } = useOperation();
  const {
    activity: { activityList, addActivity, setActivityList },
  } = useModel();

  const [isDragging, setIsDragging] = createSignal<boolean>(false);
  const [offset, setOffset] = createSignal({ x: 0, y: 0 });
  const [size, setSize] = createSignal({ width: 0, height: 0 });

  const [dragTarget, setDragTarget] = createSignal<{
    target: "activity" | "screen";
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
        setActivityList(
          (it) => it.id === dragTarget().id,
          produce((it) => {
            it.x = it.x + e.movementX / props.zoom;
            it.y = it.y + e.movementY / props.zoom;
          })
        );
        break;
    }
  }

  function handleDiagramMouseUp() {
    setIsDragging(false);
  }

  function handleActivityMouseDown(e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        e.stopPropagation();
        const actId = (e.target as SVGElement).id;
        setDragTarget({ target: "activity", id: actId });
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
            <circle
              id={activity.id}
              cx={activity.x}
              cy={activity.y}
              r={50}
              fill="red"
              onMouseDown={handleActivityMouseDown}
            />
          )}
        </For>
      </svg>
    </div>
  );
}
