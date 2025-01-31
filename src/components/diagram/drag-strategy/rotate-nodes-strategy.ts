import type { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";
import { defaultPoint } from "@/constants/app-const";
import type { DiagramModel } from "@/data-model/diagram-model";
import type { NodeModel } from "@/data-model/node-model";
import type { Point } from "@/data-source/data-type";

export function makeRotateNodesStrategy(diagramModel: DiagramModel, nodeModel: NodeModel): DragStrategy {
  let basePoint: Point = defaultPoint;

  function handlePointerDown(e: PointerEvent) {
    basePoint = diagramModel.normalizePoint(e.clientX, e.clientY);
  }

  function handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>) {
    const prevEvent = pointerEvents.get(e.pointerId);
    if (prevEvent == null || pointerEvents.size > 1) return;

    const moveX = (e.clientX - prevEvent.clientX) / diagramModel.zoom();
    const moveY = (e.clientY - prevEvent.clientY) / diagramModel.zoom();
    nodeModel.rotateSelectedNodes(basePoint, moveX, moveY);
  }

  function handlePointerUp(_e: PointerEvent) {
    // do nothing
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
