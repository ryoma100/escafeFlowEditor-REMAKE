import { PointerStrategy } from "@/components/diagram/listeners/base-strategy";
import { defaultPoint } from "@/constants/app-const";
import { DiagramModel } from "@/data-model/diagram-model";
import { ExtendEdgeModel } from "@/data-model/extend-edge-model";
import { NodeModel } from "@/data-model/node-model";
import { Point } from "@/data-source/data-type";
import { INode } from "@/data-source/data-type";
import { containsRect } from "@/utils/rectangle-utils";

export function makeAddCommentEdgeStrategy(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
  extendEdgeModel: ExtendEdgeModel,
): PointerStrategy {
  let fromPoint: Point = defaultPoint;

  function handlePointerDown(e: PointerEvent, target: { node: INode }) {
    e.stopPropagation();

    fromPoint = {
      x: target.node.x + target.node.width,
      y: target.node.y + target.node.height / 2,
    };
    nodeModel.changeSelectNodes("select", [target.node.id]);
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
    if (node?.type !== "activityNode") return;

    extendEdgeModel.addCommentEdge(node.id);
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
