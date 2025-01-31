import type { DiagramModel } from "@/data-model/diagram-model";
import type { Point } from "@/data-source/data-type";
import { centerPoint, lineDistance } from "@/utils/line-utils";

export function makeMultiTouchListener(diagramModel: DiagramModel) {
  function handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>) {
    const prevEvent = pointerEvents.get(e.pointerId);
    if (prevEvent == null) return;

    const prevEvents = Array.from(pointerEvents.values());
    const prevP1: Point = {
      x: prevEvents[0].clientX,
      y: prevEvents[0].clientY,
    };
    const prevP2: Point = {
      x: prevEvents[1].clientX,
      y: prevEvents[1].clientY,
    };
    const prevTouchPoints = { p1: prevP1, p2: prevP2 };
    const prevCenterPoint = centerPoint(prevTouchPoints);
    const prevDistance = lineDistance(prevTouchPoints);

    pointerEvents.set(e.pointerId, e);
    const newEvents = Array.from(pointerEvents.values());
    const newP1: Point = { x: newEvents[0].clientX, y: newEvents[0].clientY };
    const newP2: Point = { x: newEvents[1].clientX, y: newEvents[1].clientY };
    const newTouchPoints = { p1: newP1, p2: newP2 };
    const newCenterPoint = centerPoint(newTouchPoints);
    const newDistance = lineDistance(newTouchPoints);

    diagramModel.changeZoom(diagramModel.zoom() + (newDistance - prevDistance) / prevDistance, newCenterPoint);
    diagramModel.setViewBox({
      x: diagramModel.viewBox().x - (newCenterPoint.x - prevCenterPoint.x),
      y: diagramModel.viewBox().y - (newCenterPoint.y - prevCenterPoint.y),
      width: diagramModel.viewBox().width,
      height: diagramModel.viewBox().height,
    });
  }

  return {
    handlePointerMove,
  };
}
