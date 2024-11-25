import { makeDragScrollDelegate } from "@/components/diagram/drag-strategy/drag-scroll-delegate";
import { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";
import { DiagramModel } from "@/data-model/diagram-model";
import { EdgeModel } from "@/data-model/edge-model";
import { NodeModel } from "@/data-model/node-model";
import { INode, Point } from "@/data-source/data-type";

export function makeMoveNodesStrategy(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
  edgeModel: EdgeModel,
): DragStrategy {
  const dragScrollDelegate = makeDragScrollDelegate(diagramModel);

  function handlePointerDown(e: PointerEvent, node: INode) {
    e.stopPropagation();

    if (!node.selected) {
      nodeModel.changeSelectNodes("select", [node.id]);
      edgeModel.changeSelectEdges("clearAll");
    }
    nodeModel.changeTopLayer(node.id);
  }

  function handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>) {
    const prevEvent = pointerEvents.get(e.pointerId);
    if (prevEvent == null || pointerEvents.size > 2) return;

    dragScrollDelegate.handlePointerMove(e, (delta: Point | null) => {
      const moveX = (e.clientX - prevEvent.clientX - (delta?.x ?? 0)) / diagramModel.zoom();
      const moveY = (e.clientY - prevEvent.clientY - (delta?.y ?? 0)) / diagramModel.zoom();
      nodeModel.moveSelectedNodes(moveX, moveY);
    });
  }

  function handlePointerUp(e: PointerEvent) {
    dragScrollDelegate.handlePointerUp(e);
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
