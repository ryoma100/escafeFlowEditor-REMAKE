import { createSignal } from "solid-js";

import { ToolbarType } from "@/components/toolbar/toolbar";
import { defaultLine, defaultRectangle } from "@/constants/app-const";
import {
  ActivityNode,
  CommentNode,
  Line,
  Point,
  Rectangle,
  StartNode,
} from "@/data-source/data-type";

export type DragModeType =
  | { type: "none" }
  | { type: "select"; startPoint: Point }
  | { type: "boxSelect"; centerPoint: Point }
  | { type: "circleSelect"; centerPoint: Point }
  | { type: "scroll" }
  | { type: "contextMenuScroll" }
  | { type: "moveNodes" }
  | { type: "scaleNodes"; basePoint: Point }
  | { type: "rotateNodes"; basePoint: Point }
  | { type: "resizeActivityLeft" }
  | { type: "resizeActivityRight" }
  | { type: "addActivity" }
  | { type: "addTransition"; fromActivity: ActivityNode }
  | { type: "addCommentNode" }
  | { type: "addCommentEdge"; fromComment: CommentNode }
  | { type: "addStartNode" }
  | { type: "addStartEdge"; fromStart: StartNode }
  | { type: "addEndNode" }
  | { type: "addEndEdge"; fromActivity: ActivityNode };

export function makeDiagramModel() {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [zoom, setZoom] = createSignal<number>(1.0);
  const [dragMode, setDragMode] = createSignal<DragModeType>({ type: "none" });
  const [addingLine, setAddingLine] = createSignal<Line>(defaultLine);
  const [svgRect, setSvgRect] = createSignal(defaultRectangle);
  const [viewBox, setViewBox] = createSignal(defaultRectangle);
  const [graphRect, setGraphRect] = createSignal(defaultRectangle);

  function setAddingLineFrom(x: number, y: number) {
    setAddingLine({ p1: { x, y }, p2: { x, y } });
  }

  function setAddingLineTo(x: number, y: number) {
    setAddingLine({ p1: addingLine().p1, p2: { x, y } });
  }

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
    const newZoom = Math.min(
      svgRect().width / graphRect().width,
      svgRect().height / graphRect().height,
    );
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

  return {
    toolbar,
    setToolbar,
    zoom,
    changeZoom,
    dragMode,
    setDragMode,
    addingLine,
    setAddingLineFrom,
    setAddingLineTo,
    svgRect,
    changeSvgRect,
    fitViewBox,
    viewBox,
    setViewBox,
    graphRect,
    changeGraphRect,
    initViewBox,
  };
}
