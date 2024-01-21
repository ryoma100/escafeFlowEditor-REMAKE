import { createEffect, createSignal, onMount } from "solid-js";
import "./diagram.css";

export function Diagram() {
  const [svgSize, setSvgSize] = createSignal({ width: 0, height: 0 });

  onMount(() => {
    setSvgSize({
      width: svg?.clientWidth ?? 0,
      height: svg?.clientHeight ?? 0,
    });
    window.addEventListener("resize", () => {
      setSvgSize({
        width: svg?.clientWidth ?? 0,
        height: svg?.clientHeight ?? 0,
      });
    });
  });

  function viewBox() {
    return `${point().x} ${point().y} ${svgSize().width} ${svgSize().height}`;
  }

  createEffect(() => {
    console.log("svg", svgSize());
  });

  const [point, setPoint] = createSignal({ x: 0, y: 0 });
  const [isMove, setIsMove] = createSignal(false);

  function handleMouseDown(e: MouseEvent) {
    setIsMove(true);
  }

  function handleMouseMove(e: MouseEvent) {
    if (isMove()) {
      setPoint({ x: point().x - e.movementX, y: point().y - e.movementY });
    }
  }

  function handleMouseUp(e: MouseEvent) {
    setIsMove(false);
  }

  let svg: SVGSVGElement | undefined;
  return (
    <div class="diagram">
      <svg
        ref={svg}
        width={svgSize().width}
        height={svgSize().height}
        viewBox={viewBox()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <circle cx="100" cy="100" r="50" fill="blue" />
      </svg>
    </div>
  );
}
