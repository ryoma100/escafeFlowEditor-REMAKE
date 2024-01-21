import { createSignal, onMount } from "solid-js";
import "./diagram.css";

export function Diagram() {
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
  });

  function handleMouseDown() {
    document.addEventListener("mousemove", handleMouseMove);
  }

  function handleMouseMove(e: MouseEvent) {
    setPoint({ x: point().x - e.movementX, y: point().y - e.movementY });
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
  }

  let svg: SVGSVGElement | undefined;
  return (
    <div
      class="diagram"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <svg
        ref={svg}
        width={size().width}
        height={size().height}
        viewBox={`${point().x} ${point().y} ${size().width} ${size().height}`}
      >
        <circle cx="100" cy="100" r="50" fill="blue" />
      </svg>
    </div>
  );
}
