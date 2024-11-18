import { PointerStrategy } from "@/components/diagram/listener/pointer-listener";
import { ActivityNodeModel } from "@/data-model/activity-node-model";
import { DiagramModel } from "@/data-model/diagram-model";
import { INode } from "@/data-source/data-type";

export function makeResizeActivityRightStrategy(
  diagramModel: DiagramModel,
  activityModel: ActivityNodeModel,
): PointerStrategy {
  function handlePointerDown(e: PointerEvent, node: INode) {
    e.stopPropagation();

    activityModel.nodeModel.changeSelectNodes("select", [node.id]);
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
