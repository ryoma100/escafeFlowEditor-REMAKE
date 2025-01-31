import type { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";
import { defaultPoint } from "@/constants/app-const";
import type { DiagramModel } from "@/data-model/diagram-model";
import type { ExtendEdgeModel } from "@/data-model/extend-edge-model";
import type { NodeModel } from "@/data-model/node-model";
import type { Point } from "@/data-source/data-type";
import type { INode } from "@/data-source/data-type";
import { containsRect } from "@/utils/rectangle-utils";

export function makeAddStartEdgeStrategy(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
  extendEdgeModel: ExtendEdgeModel,
): DragStrategy {
  const edgeModel = extendEdgeModel.edgeModel;
  let fromNode: INode | null = null;
  let fromPoint: Point = defaultPoint;

  function handlePointerDown(e: PointerEvent, node: INode) {
    e.stopPropagation();
    if (edgeModel.edgeList.some((it) => it.fromNodeId === node.id)) {
      fromNode = null;
      return;
    }

    fromNode = node;
    fromPoint = { x: node.x + node.width, y: node.y + node.height / 2 };
    nodeModel.changeSelectNodes("select", [node.id]);
    diagramModel.setAddingLine({ p1: fromPoint, p2: fromPoint });
  }

  function handlePointerMove(e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {
    if (fromNode == null) return;

    diagramModel.setAddingLine({
      p1: fromPoint,
      p2: {
        x: diagramModel.viewBox().x + (e.clientX - diagramModel.svgRect().x) / diagramModel.zoom(),
        y: diagramModel.viewBox().y + (e.clientY - diagramModel.svgRect().y) / diagramModel.zoom(),
      },
    });
  }

  function handlePointerUp(e: PointerEvent) {
    if (fromNode == null) return;

    diagramModel.setAddingLine(null);
    const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);
    const node = nodeModel.nodeList.find((it) => containsRect(it, { x, y }));
    if (node?.type !== "activityNode") return;

    extendEdgeModel.addStartEdge(fromNode, node);
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
