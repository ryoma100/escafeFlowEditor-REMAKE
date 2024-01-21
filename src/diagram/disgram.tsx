import { createSignal, onMount } from "solid-js";
import "./diagram.css";

type MoveType = "none" | "scroll" | "item";

export function Diagram(props: { zoom: number }) {
  const [moveType, setMoveType] = createSignal<MoveType>("none");
  const [point, setPoint] = createSignal({ x: 0, y: 0 });
  const [size, setSize] = createSignal({ width: 0, height: 0 });

  function handleDiagramMouseDown() {
    setMoveType("scroll");
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

  function handleDiagramMouseUp() {
    setMoveType("none");
  }

  function viewBox() {
    return `${point().x} ${point().y} ${size().width / props.zoom} ${size().height / props.zoom}`;
  }

  // TODO: テスト用
  const [itemPosition, setItemPosition] = createSignal({ x: 100, y: 100 });
  function handleItemMouseDown(e: MouseEvent) {
    e.stopPropagation();
    setMoveType("item");
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
