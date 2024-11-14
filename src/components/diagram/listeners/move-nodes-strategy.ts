import { PointerStrategy } from "@/components/diagram/listeners/base-strategy";
import { DiagramModel } from "@/data-model/diagram-model";
import { EdgeModel } from "@/data-model/edge-model";
import { NodeModel } from "@/data-model/node-model";
import { INode } from "@/data-source/data-type";

export function makeMoveNodesStrategy(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
  edgeModel: EdgeModel,
): PointerStrategy {
  function handlePointerDown(e: PointerEvent, target: { node: INode }) {
    e.stopPropagation();

    if (!target.node.selected) {
      nodeModel.changeSelectNodes("select", [target.node.id]);
      edgeModel.changeSelectEdges("clearAll");
    }
    nodeModel.changeTopLayer(target.node.id);
  }

  function handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>) {
    const prevEvent = pointerEvents.get(e.pointerId);
    if (prevEvent == null || pointerEvents.size > 2) return;

    const moveX = (e.clientX - prevEvent.clientX) / diagramModel.zoom();
    const moveY = (e.clientY - prevEvent.clientY) / diagramModel.zoom();
    nodeModel.moveSelectedNodes(moveX, moveY);
  }

  function handlePointerUp(_e: PointerEvent) {}

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
