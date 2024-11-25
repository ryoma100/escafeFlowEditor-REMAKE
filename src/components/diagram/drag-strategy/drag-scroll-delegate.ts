import { DiagramModel } from "@/data-model/diagram-model";
import { Point } from "@/data-source/data-type";
import { intersectionWithRectangle } from "@/utils/line-utils";
import { centerPoint } from "@/utils/rectangle-utils";

const MAX_DELTA = 8;

export function makeDragScrollDelegate(diagramModel: DiagramModel) {
  let timer: ReturnType<typeof setTimeout> | null;

  function handlePointerMove(e: PointerEvent, onPointerMove?: (delta: Point | null) => void) {
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }

    const svgRect = diagramModel.svgRect();
    const line = { p1: centerPoint(svgRect), p2: { x: e.clientX, y: e.clientY } };
    const crossPoint: Point | null = intersectionWithRectangle(svgRect, line);
    if (crossPoint != null) {
      handleIntervalListener(e, crossPoint, onPointerMove);
      timer = setInterval(() => {
        handleIntervalListener(e, crossPoint, onPointerMove);
      }, 50);
    } else {
      onPointerMove?.(null);
    }
  }

  function handleIntervalListener(
    e: PointerEvent,
    crossPoint: Point,
    onPointerMove?: (delta: Point | null) => void,
  ) {
    const dx = Math.min(MAX_DELTA, Math.max(-MAX_DELTA, crossPoint.x - e.clientX));
    const dy = Math.min(MAX_DELTA, Math.max(-MAX_DELTA, crossPoint.y - e.clientY));
    diagramModel.setViewBox({
      x: diagramModel.viewBox().x - dx,
      y: diagramModel.viewBox().y - dy,
      width: diagramModel.viewBox().width,
      height: diagramModel.viewBox().height,
    });
    onPointerMove?.({ x: dx, y: dy });
  }

  function handlePointerUp(_e: PointerEvent) {
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }
  }

  return {
    handlePointerMove,
    handlePointerUp,
  };
}
