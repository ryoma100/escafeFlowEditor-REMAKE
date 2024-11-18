import { PointerStrategy } from "@/components/diagram/listener/pointer-listener";
import { DiagramModel } from "@/data-model/diagram-model";

export function makeScrollStrategy(diagramModel: DiagramModel): PointerStrategy {
  let isContextMenu = false;

  function handlePointerDown(e: PointerEvent) {
    isContextMenu = e.pointerType === "mouse" && e.button === 2;
  }

  function handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>) {
    isContextMenu = false;

    const prevEvent = pointerEvents.get(e.pointerId);
    if (prevEvent == null || pointerEvents.size > 2) return;

    const moveX = (e.clientX - prevEvent.clientX) / diagramModel.zoom();
    const moveY = (e.clientY - prevEvent.clientY) / diagramModel.zoom();
    diagramModel.setViewBox({
      x: diagramModel.viewBox().x - moveX,
      y: diagramModel.viewBox().y - moveY,
      width: diagramModel.viewBox().width,
      height: diagramModel.viewBox().height,
    });
  }

  function handlePointerUp(e: PointerEvent) {
    if (isContextMenu) {
      diagramModel.setContextMenuPoint({ x: e.pageX, y: e.pageY });
    }
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
