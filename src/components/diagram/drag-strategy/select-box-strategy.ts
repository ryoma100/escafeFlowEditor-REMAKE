import { produce } from "solid-js/store";

import { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";
import { defaultPoint } from "@/constants/app-const";
import { DiagramModel } from "@/data-model/diagram-model";
import { EdgeModel } from "@/data-model/edge-model";
import { NodeModel } from "@/data-model/node-model";
import { Point, Rectangle } from "@/data-source/data-type";
import { intersectRect } from "@/utils/rectangle-utils";

export function makeSelectBoxStrategy(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
  edgeModel: EdgeModel,
): DragStrategy {
  let centerPoint: Point = defaultPoint;

  function handlePointerDown(e: PointerEvent) {
    centerPoint = diagramModel.normalizePoint(e.clientX, e.clientY);
    diagramModel.setSelectBox(null);
  }

  function handlePointerMove(e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {
    const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);

    const diffX = Math.abs(x - centerPoint.x);
    const diffY = Math.abs(y - centerPoint.y);
    const rect: Rectangle = {
      x: centerPoint.x - diffX,
      y: centerPoint.y - diffY,
      width: diffX * 2,
      height: diffY * 2,
    };
    diagramModel.setSelectBox(rect);
    nodeModel.setNodeList(
      (_it) => true,
      produce((it) => (it.selected = intersectRect(rect, it))),
    );
    edgeModel.setEdgeList(() => true, "selected", false);
  }

  function handlePointerUp(_e: PointerEvent) {
    diagramModel.setSelectBox(null);
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
