import { createSignal, onMount } from "solid-js";
import "./diagram.css";

export function Diagram(props: { zoom: number }) {
  const [point, setPoint] = createSignal({ x: 0, y: 0 });
  const [size, setSize] = createSignal({ width: 0, height: 0 });

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

  type MoveType = "none" | "scroll" | "item";
  const [moveType, setMoveType] = createSignal<MoveType>("none");

  function handleDiagramMouseDown() {
    setMoveType("scroll");
  }

  function handleDiagramMouseMove(e: MouseEvent) {
    switch (moveType()) {
      case "scroll":
        setPoint({
          x: point().x - e.movementX / props.zoom,
          y: point().y - e.movementY / props.zoom,
        });
        break;
      case "item":
        setItemPosition({
          x: itemPosition().x + e.movementX / props.zoom,
          y: itemPosition().y + e.movementY / props.zoom,
        });
        break;
    }
  }

  function viewBox() {
    return `${point().x} ${point().y} ${size().width / props.zoom} ${size().height / props.zoom}`;
  }

  const [itemPosition, setItemPosition] = createSignal({ x: 100, y: 100 });
  function handleItemMouseDown(e: MouseEvent) {
    e.stopPropagation();
    setMoveType("item");
  }

  function handleDiagramMouseUp() {
    setMoveType("none");
  }

  let svg: SVGSVGElement | undefined;
  return (
    <div class="diagram">
      <svg
        ref={svg}
        width={size().width}
        height={size().height}
        viewBox={viewBox()}
        onMouseDown={handleDiagramMouseDown}
      >
        <circle
          cx={itemPosition().x}
          cy={itemPosition().y}
          r="50"
          fill="blue"
          onMouseDown={handleItemMouseDown}
        />
        <circle cx="300" cy="300" r="40" fill="red" />
      </svg>
    </div>
  );
}
