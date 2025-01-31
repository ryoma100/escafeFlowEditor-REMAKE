import { createSignal } from "solid-js";

import type { ToolbarType } from "@/components/toolbar/toolbar";
import { defaultRectangle } from "@/constants/app-const";
import type { Circle, Line, Point, Rectangle } from "@/data-source/data-type";

export type DiagramModel = ReturnType<typeof makeDiagramModel>;

export function makeDiagramModel() {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [zoom, setZoom] = createSignal<number>(1.0);
  const [addingLine, setAddingLine] = createSignal<Line | null>(null);
  const [svgRect, setSvgRect] = createSignal(defaultRectangle);
  const [viewBox, setViewBox] = createSignal(defaultRectangle);
  const [graphRect, setGraphRect] = createSignal(defaultRectangle);
  const [contextMenuPoint, setContextMenuPoint] = createSignal<Point | null>(null);
  const [selectBox, setSelectBox] = createSignal<Rectangle | null>(null);
  const [selectCircle, setSelectCircle] = createSignal<Circle | null>(null);

  function initViewBox() {
    setZoom(1.0);

    const newViewBox = {
      x: graphRect().x + (graphRect().width - svgRect().width) / 2,
      y: graphRect().y + (graphRect().height - svgRect().height) / 2,
      width: svgRect().width,
      height: svgRect().height,
    };
    setViewBox(newViewBox);
  }

  function fitViewBox() {
    const newZoom = Math.min(svgRect().width / graphRect().width, svgRect().height / graphRect().height);
    changeZoom(newZoom);

    const newViewBox = {
      x: graphRect().x + (graphRect().width - viewBox().width) / 2,
      y: graphRect().y + (graphRect().height - viewBox().height) / 2,
      width: viewBox().width,
      height: viewBox().height,
    };
    setViewBox(newViewBox);
  }

  function changeSvgRect(rect: Rectangle) {
    setSvgRect(rect);
    changeZoom(zoom());
  }

  function changeZoom(newZoom: number, point: Point | null = null) {
    const zoom = Math.min(Math.max(newZoom, 0.1), 2);

    const width = svgRect().width / zoom;
    const height = svgRect().height / zoom;
    const x =
      point != null
        ? viewBox().x - (width - viewBox().width) / (svgRect().width / (point.x - svgRect().x))
        : viewBox().x - (width - viewBox().width) / 2;
    const y =
      point != null
        ? viewBox().y - (height - viewBox().height) / (svgRect().height / (point.y - svgRect().y))
        : viewBox().y - (height - viewBox().height) / 2;

    setZoom(zoom);
    setViewBox({ x, y, width, height });
  }

  function changeGraphRect(rect: Rectangle) {
    if (
      graphRect().x !== rect.x ||
      graphRect().y !== rect.y ||
      graphRect().width !== rect.width ||
      graphRect().height !== rect.height
    ) {
      setGraphRect(rect);
    }
  }

  function normalizePoint(clientX: number, clientY: number): Point {
    const x = viewBox().x + (clientX - svgRect().x) / zoom();
    const y = viewBox().y + (clientY - svgRect().y) / zoom();
    return { x, y };
  }

  return {
    toolbar,
    setToolbar,
    zoom,
    changeZoom,
    addingLine,
    setAddingLine,
    svgRect,
    changeSvgRect,
    fitViewBox,
    viewBox,
    setViewBox,
    graphRect,
    changeGraphRect,
    initViewBox,
    contextMenuPoint,
    setContextMenuPoint,
    normalizePoint,
    selectBox,
    setSelectBox,
    selectCircle,
    setSelectCircle,
  };
}
