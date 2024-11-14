import { PointerStrategy } from "@/components/diagram/listeners/base-strategy";
import { ActivityNodeModel } from "@/data-model/activity-node-model";
import { DiagramModel } from "@/data-model/diagram-model";
import { ActivityNode } from "@/data-source/data-type";

export function makeResizeActivityLeftStrategy(
  diagramModel: DiagramModel,
  activityModel: ActivityNodeModel,
): PointerStrategy {
  function handlePointerDown(e: PointerEvent, target: { activity: ActivityNode }) {
    e.stopPropagation();

    activityModel.nodeModel.changeSelectNodes("select", [target.activity.id]);
  }

  function handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>) {
    const prevEvent = pointerEvents.get(e.pointerId);
    if (prevEvent == null || pointerEvents.size > 2) return;

    const moveX = (e.clientX - prevEvent.clientX) / diagramModel.zoom();
    activityModel.resizeLeft(moveX);
  }

  function handlePointerUp(_e: PointerEvent) {}

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
