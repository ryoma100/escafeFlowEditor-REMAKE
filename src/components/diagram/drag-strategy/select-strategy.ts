import { produce } from "solid-js/store";

import { makeDragScrollDelegate } from "@/components/diagram/drag-strategy/drag-scroll-delegate";
import type { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";
import { defaultPoint } from "@/constants/app-const";
import type { DiagramModel } from "@/data-model/diagram-model";
import type { EdgeModel } from "@/data-model/edge-model";
import type { NodeModel } from "@/data-model/node-model";
import type { Point, Rectangle } from "@/data-source/data-type";
import { intersectRect } from "@/utils/rectangle-utils";

export function makeSelectStrategy(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
  edgeModel: EdgeModel,
): DragStrategy {
  const dragScrollDelegate = makeDragScrollDelegate(diagramModel);
  let startPoint: Point = defaultPoint;

  function handlePointerDown(e: PointerEvent) {
    startPoint = diagramModel.normalizePoint(e.clientX, e.clientY);
    diagramModel.setSelectBox(null);
  }

  function handlePointerMove(e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {
    dragScrollDelegate.handlePointerMove(e);
    const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);

    const rect: Rectangle = {
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
    };
    diagramModel.setSelectBox(rect);
    nodeModel.setNodeList(
      () => true,
      produce((it) => {
        it.selected = intersectRect(rect, it);
      }),
    );
    edgeModel.setEdgeList(() => true, "selected", false);
  }

  function handlePointerUp(e: PointerEvent) {
    dragScrollDelegate.handlePointerUp(e);
    diagramModel.setSelectBox(null);
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
