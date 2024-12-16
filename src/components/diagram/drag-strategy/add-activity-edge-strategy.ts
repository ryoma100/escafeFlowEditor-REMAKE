import { makeDragScrollDelegate } from "@/components/diagram/drag-strategy/drag-scroll-delegate";
import { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";
import { ActivityNodeModel } from "@/data-model/activity-node-model";
import { DiagramModel } from "@/data-model/diagram-model";
import { ExtendEdgeModel } from "@/data-model/extend-edge-model";
import { TransitionEdgeModel } from "@/data-model/transaction-edge-model";
import { INode, Point } from "@/data-source/data-type";
import { containsRect } from "@/utils/rectangle-utils";

export function makeAddActivityEdgeStrategy(
  diagramModel: DiagramModel,
  activityNodeModel: ActivityNodeModel,
  transitionEdgeModel: TransitionEdgeModel,
  extendEdgeModel: ExtendEdgeModel,
): DragStrategy {
  const dragScrollDelegate = makeDragScrollDelegate(diagramModel);
  const nodeModel = activityNodeModel.nodeModel;
  const edgeModel = transitionEdgeModel.edgeModel;
  let fromNode: INode;
  let fromPoint: Point;

  function handlePointerDown(e: PointerEvent, node: INode) {
    e.stopPropagation();

    fromNode = node;
    fromPoint = { x: node.x + node.width / 2, y: node.y + node.height / 2 };
    nodeModel.changeSelectNodes("select", [node.id]);
    edgeModel.changeSelectEdges("clearAll");
    diagramModel.setAddingLine({ p1: fromPoint, p2: fromPoint });
  }

  function handlePointerMove(e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {
    dragScrollDelegate.handlePointerMove(e);
    diagramModel.setAddingLine({
      p1: fromPoint,
      p2: {
        x: diagramModel.viewBox().x + (e.clientX - diagramModel.svgRect().x) / diagramModel.zoom(),
        y: diagramModel.viewBox().y + (e.clientY - diagramModel.svgRect().y) / diagramModel.zoom(),
      },
    });
  }

  function handlePointerUp(e: PointerEvent) {
    dragScrollDelegate.handlePointerUp(e);
    diagramModel.setAddingLine(null);

    const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);
    const node = nodeModel.nodeList.find((it) => containsRect(it, { x, y }));
    if (node == null) return;

    switch (node.type) {
      case "activityNode":
        transitionEdgeModel.addTransitionEdge(fromNode.id, node.id);
        break;
      case "endNode":
        extendEdgeModel.addEndEdge(fromNode, node);
        break;
    }
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
