import type { IEdge, INode } from "@/data-source/data-type";

export type DragStrategy = {
  handlePointerDown(e: PointerEvent, node?: INode, edge?: IEdge): void;
  handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>): void;
  handlePointerUp(e: PointerEvent): void;
};
