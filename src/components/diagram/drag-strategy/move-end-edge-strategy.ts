import { makeDragScrollDelegate } from "@/components/diagram/drag-strategy/drag-scroll-delegate";
import { ActivityNodeModel } from "@/data-model/activity-node-model";
import { DiagramModel } from "@/data-model/diagram-model";
import { ExtendEdgeModel } from "@/data-model/extend-edge-model";
import { TransitionEdgeModel } from "@/data-model/transaction-edge-model";
import { IEdge, INode, Point } from "@/data-source/data-type";
import { containsRect } from "@/utils/rectangle-utils";

export function makeMoveEndEdgeStrategy(
  diagramModel: DiagramModel,
  activityNodeModel: ActivityNodeModel,
  transitionEdgeModel: TransitionEdgeModel,
  extendEdgeModel: ExtendEdgeModel,
) {
  const dragScrollDelegate = makeDragScrollDelegate(diagramModel);
  const nodeModel = activityNodeModel.nodeModel;
  const edgeModel = transitionEdgeModel.edgeModel;
  let targetEdge: IEdge;
  let startNode: INode;
  let startPoint: Point;

  function handlePointerDown(e: PointerEvent, node: INode, edge: IEdge) {
    e.stopPropagation();

    targetEdge = edge;
    startNode = node;
    startPoint = { x: startNode.x + startNode.width / 2, y: startNode.y + startNode.height / 2 };
    drawEdge(e);
  }

  function handlePointerMove(e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {
    dragScrollDelegate.handlePointerMove(e);
    drawEdge(e);
  }

  function drawEdge(e: PointerEvent) {
    diagramModel.setAddingLine({
      p1: startPoint,
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
    const endNode = nodeModel.nodeList.find((it) => containsRect(it, { x, y }));
    if (endNode == null || endNode.id === startNode.id) return;

    switch (true) {
      case startNode.type === "activityNode" && endNode.type === "activityNode":
        if (transitionEdgeModel.addTransitionEdge(startNode, endNode)) {
          edgeModel.deleteEdge(targetEdge.id);
        }
        return;
      case startNode.type === "startNode" && endNode.type === "activityNode":
        if (extendEdgeModel.addStartEdge(startNode, endNode)) {
          edgeModel.deleteEdge(targetEdge.id);
        }
        return;
      case startNode.type === "commentNode" && endNode.type === "activityNode":
        if (extendEdgeModel.addCommentEdge(startNode, endNode)) {
          edgeModel.deleteEdge(targetEdge.id);
        }
        return;
      case startNode.type === "activityNode" && endNode.type === "endNode":
        if (extendEdgeModel.addEndEdge(startNode, endNode)) {
          edgeModel.deleteEdge(targetEdge.id);
        }
        return;
    }
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
