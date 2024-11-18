import { PointerStrategy } from "@/components/diagram/listener/pointer-listener";
import { defaultPoint } from "@/constants/app-const";
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
): PointerStrategy {
  const nodeModel = activityNodeModel.nodeModel;
  let fromPoint: Point = defaultPoint;

  function handlePointerDown(e: PointerEvent, node: INode) {
    e.stopPropagation();

    fromPoint = { x: node.x + node.width, y: node.y + node.height / 2 };
    nodeModel.changeSelectNodes("select", [node.id]);
    diagramModel.setAddingLine({ p1: fromPoint, p2: fromPoint });
  }

  function handlePointerMove(e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {
    diagramModel.setAddingLine({
      p1: fromPoint,
      p2: {
        x: diagramModel.viewBox().x + (e.clientX - diagramModel.svgRect().x) / diagramModel.zoom(),
        y: diagramModel.viewBox().y + (e.clientY - diagramModel.svgRect().y) / diagramModel.zoom(),
      },
    });
  }

  function handlePointerUp(e: PointerEvent) {
    diagramModel.setAddingLine(null);

    const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);
    const node = nodeModel.nodeList.find((it) => containsRect(it, { x, y }));
    switch (node?.type) {
      case "activityNode":
        addTransitionEdge(node);
        break;
      case "endNode":
        extendEdgeModel.addEndEdge(node.id);
        break;
    }
  }

  function addTransitionEdge(node: INode) {
    const transition = transitionEdgeModel.addTransitionEdge(node.id);
    if (transition) {
      activityNodeModel.updateJoinType(
        transition.toNodeId,
        transitionEdgeModel.getTransitionEdges().filter((it) => it.toNodeId === transition.toNodeId)
          .length,
      );
      activityNodeModel.updateSplitType(
        transition.fromNodeId,
        transitionEdgeModel
          .getTransitionEdges()
          .filter((it) => it.fromNodeId === transition.fromNodeId).length,
      );
    }
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
