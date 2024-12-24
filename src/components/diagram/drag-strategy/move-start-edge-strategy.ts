import { makeDragScrollDelegate } from "@/components/diagram/drag-strategy/drag-scroll-delegate";
import { ACTIVITY_EAR_WIDTH } from "@/constants/app-const";
import { DiagramModel } from "@/data-model/diagram-model";
import { ExtendEdgeModel } from "@/data-model/extend-edge-model";
import { ExtendNodeModel } from "@/data-model/extend-node-model";
import { TransitionEdgeModel } from "@/data-model/transaction-edge-model";
import { IEdge, INode, Point } from "@/data-source/data-type";
import { containsRect } from "@/utils/rectangle-utils";

export function makeMoveStartEdgeStrategy(
  diagramModel: DiagramModel,
  extendNodeModel: ExtendNodeModel,
  transitionEdgeModel: TransitionEdgeModel,
  extendEdgeModel: ExtendEdgeModel,
) {
  const dragScrollDelegate = makeDragScrollDelegate(diagramModel);
  const nodeModel = extendNodeModel.nodeModel;
  const edgeModel = extendEdgeModel.edgeModel;
  let targetEdge: IEdge;
  let endNode: INode;
  let endPoint: Point;

  function handlePointerDown(e: PointerEvent, node: INode, edge: IEdge) {
    e.stopPropagation();

    targetEdge = edge;
    endNode = node;
    if (edge.type === "transitionEdge") {
      endPoint = { x: endNode.x - ACTIVITY_EAR_WIDTH, y: endNode.y + endNode.height / 2 };
    } else {
      endPoint = { x: endNode.x + endNode.width / 2, y: endNode.y + endNode.height / 2 };
    }
    edgeModel.changeDisableEdge("disable", edge.id);
    drawEdge(e);
  }

  function handlePointerMove(e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {
    dragScrollDelegate.handlePointerMove(e);
    drawEdge(e);
  }

  function drawEdge(e: PointerEvent) {
    diagramModel.setAddingLine({
      p1: {
        x: diagramModel.viewBox().x + (e.clientX - diagramModel.svgRect().x) / diagramModel.zoom(),
        y: diagramModel.viewBox().y + (e.clientY - diagramModel.svgRect().y) / diagramModel.zoom(),
      },
      p2: endPoint,
    });
  }

  function handlePointerUp(e: PointerEvent) {
    dragScrollDelegate.handlePointerUp(e);
    edgeModel.changeDisableEdge("clearDisable", targetEdge.id);
    diagramModel.setAddingLine(null);

    const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);
    const startNode = nodeModel.nodeList.find((it) => containsRect(it, { x, y }));
    if (startNode == null || startNode.id === endNode.id) return;

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
