import type { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";

export function makeDefaultStrategy(): DragStrategy {
  function handlePointerDown(_e: PointerEvent) {
    // do nothing
  }

  function handlePointerMove(_e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {
    // do nothing
  }

  function handlePointerUp(_e: PointerEvent) {
    // do nothing
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
