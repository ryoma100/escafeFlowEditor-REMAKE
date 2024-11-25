import { DiagramModel } from "@/data-model/diagram-model";
import { Point } from "@/data-source/data-type";
import { intersectionWithRectangle } from "@/utils/line-utils";
import { centerPoint } from "@/utils/rectangle-utils";

const MAX_DELTA = 4;

export function makeDragScrollDelegate(diagramModel: DiagramModel) {
  function handlePointerMove(e: PointerEvent) {
    const svgRect = diagramModel.svgRect();
    const line = { p1: centerPoint(svgRect), p2: { x: e.clientX, y: e.clientY } };
    const crossPoint: Point | null = intersectionWithRectangle(svgRect, line);
    if (crossPoint != null) {
      const dx = Math.min(MAX_DELTA, Math.max(-MAX_DELTA, crossPoint.x - e.clientX));
      const dy = Math.min(MAX_DELTA, Math.max(-MAX_DELTA, crossPoint.y - e.clientY));
      diagramModel.setViewBox({
        x: diagramModel.viewBox().x - dx,
        y: diagramModel.viewBox().y - dy,
        width: diagramModel.viewBox().width,
        height: diagramModel.viewBox().height,
      });
    }
  }

  return {
    handlePointerMove,
  };
}
