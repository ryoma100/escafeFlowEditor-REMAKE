import { produce } from "solid-js/store";

import type { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";
import { defaultPoint } from "@/constants/app-const";
import type { DiagramModel } from "@/data-model/diagram-model";
import type { EdgeModel } from "@/data-model/edge-model";
import type { NodeModel } from "@/data-model/node-model";
import type { Point } from "@/data-source/data-type";
import { pointLength } from "@/utils/point-utils";
import { minLengthOfPointToRect } from "@/utils/rectangle-utils";

export function makeSelectCircleStrategy(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
  edgeModel: EdgeModel,
): DragStrategy {
  let centerPoint: Point = defaultPoint;

  function handlePointerDown(e: PointerEvent) {
    centerPoint = diagramModel.normalizePoint(e.clientX, e.clientY);
    diagramModel.setSelectCircle(null);
  }

  function handlePointerMove(e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {
    const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);

    const r = pointLength(centerPoint, { x, y });
    diagramModel.setSelectCircle({ cx: centerPoint.x, cy: centerPoint.y, r });
    nodeModel.setNodeList(
      (_it) => true,
      produce((it) => {
        it.selected = minLengthOfPointToRect(centerPoint, it) < r;
      }),
    );
    edgeModel.setEdgeList(() => true, "selected", false);
  }

  function handlePointerUp(_e: PointerEvent) {
    diagramModel.setSelectCircle(null);
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
