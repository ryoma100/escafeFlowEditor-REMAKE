import { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";
import { defaultPoint } from "@/constants/app-const";
import { DiagramModel } from "@/data-model/diagram-model";
import { ExtendEdgeModel } from "@/data-model/extend-edge-model";
import { NodeModel } from "@/data-model/node-model";
import { Point } from "@/data-source/data-type";
import { INode } from "@/data-source/data-type";
import { containsRect } from "@/utils/rectangle-utils";

export function makeAddStartEdgeStrategy(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
  extendEdgeModel: ExtendEdgeModel,
): DragStrategy {
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
    if (node?.type !== "activityNode") return;

    extendEdgeModel.addStartEdge(node.id);
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
