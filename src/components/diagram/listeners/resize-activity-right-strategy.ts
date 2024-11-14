import { PointerStrategy } from "@/components/diagram/listeners/base-strategy";
import { ActivityNodeModel } from "@/data-model/activity-node-model";
import { DiagramModel } from "@/data-model/diagram-model";

export function makeResizeActivityRightStrategy(
  diagramModel: DiagramModel,
  activityModel: ActivityNodeModel,
): PointerStrategy {
  function handlePointerDown(e: PointerEvent) {
    e.stopPropagation();
  }

  function handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>) {
    const prevEvent = pointerEvents.get(e.pointerId);
    if (prevEvent == null || pointerEvents.size > 2) return;

    const moveX = (e.clientX - prevEvent.clientX) / diagramModel.zoom();
    activityModel.resizeRight(moveX);
  }

  function handlePointerUp(_e: PointerEvent) {}

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
