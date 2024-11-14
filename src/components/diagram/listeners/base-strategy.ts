import { ActivityNode, INode } from "@/data-source/data-type";

export interface PointerStrategy {
  handlePointerDown(e: PointerEvent, target?: { activity?: ActivityNode; node?: INode }): void;
  handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>): void;
  handlePointerUp(e: PointerEvent): void;
}
