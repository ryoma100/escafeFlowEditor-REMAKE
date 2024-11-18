import { PointerStrategy } from "@/components/diagram/listener/pointer-listener";
import { defaultPoint } from "@/constants/app-const";
import { DiagramModel } from "@/data-model/diagram-model";
import { NodeModel } from "@/data-model/node-model";
import { Point } from "@/data-source/data-type";

export function makeRotateNodesStrategy(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
): PointerStrategy {
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

  function handlePointerUp(_e: PointerEvent) {}

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
