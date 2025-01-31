import type { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";

export function makeDefaultStrategy(): DragStrategy {
  function handlePointerDown(_e: PointerEvent) {}

  function handlePointerMove(_e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {}

  function handlePointerUp(_e: PointerEvent) {}

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
