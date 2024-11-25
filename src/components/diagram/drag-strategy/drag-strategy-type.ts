import { INode } from "@/data-source/data-type";

export type DragStrategy = {
  handlePointerDown(e: PointerEvent, node?: INode): void;
  handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>): void;
  handlePointerUp(e: PointerEvent): void;
};
