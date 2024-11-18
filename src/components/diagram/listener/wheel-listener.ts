import { DiagramModel } from "@/data-model/diagram-model";

export function makeWheelListener(diagramModel: DiagramModel) {
  function handleWheel(e: WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      const newZoom = (diagramModel.zoom() * 100 + -e.deltaY) / 100;
      diagramModel.changeZoom(newZoom, { x: e.clientX, y: e.clientY });
    } else {
      diagramModel.setViewBox({
        x: diagramModel.viewBox().x + e.deltaX * 2,
        y: diagramModel.viewBox().y + e.deltaY * 2,
        width: diagramModel.viewBox().width,
        height: diagramModel.viewBox().height,
      });
    }
  }

  return { handleWheel };
}
