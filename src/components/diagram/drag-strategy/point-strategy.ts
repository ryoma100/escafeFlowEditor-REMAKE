import { PointerStrategy } from "@/components/diagram/listener/pointer-listener";

export function makePointStrategy(): PointerStrategy {
  function handlePointerDown(_e: PointerEvent) {}

  function handlePointerMove(_e: PointerEvent, _pointerEvents: Map<number, PointerEvent>) {}

  function handlePointerUp(_e: PointerEvent) {}

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
