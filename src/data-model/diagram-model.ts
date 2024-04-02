import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { ToolbarType } from "../components/toolbar/toolbar";
import { defaultLine, defaultRectangle } from "../constants/app-const";
import {
  ActivityNode,
  CommentNode,
  Line,
  Point,
  Rectangle,
  StartNode,
} from "../data-source/data-type";
import { makeEdgeModel } from "./edge-model";
import { makeNodeModel } from "./node-model";

export type DragType =
  | { type: "none" }
  | { type: "select"; startPoint: Point }
  | { type: "boxSelect"; centerPoint: Point }
  | { type: "circleSelect"; centerPoint: Point }
  | { type: "scroll" }
  | { type: "moveNodes"; indexes: number[] }
  | { type: "resizeActivityLeft"; index: number }
  | { type: "resizeActivityRight"; index: number }
  | { type: "addActivity" }
  | { type: "addTransition"; fromActivity: ActivityNode }
  | { type: "addCommentNode" }
  | { type: "addCommentEdge"; fromComment: CommentNode }
  | { type: "addStartNode" }
  | { type: "addStartEdge"; fromStart: StartNode }
  | { type: "addEndNode" }
  | { type: "addEndEdge"; fromActivity: ActivityNode };

export function makeDiagramModel(
  nodeModel: ReturnType<typeof makeNodeModel>,
  edgeModel: ReturnType<typeof makeEdgeModel>,
) {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [zoom, setZoom] = createSignal<number>(1.0);
  const [dragType, setDragType] = createSignal<DragType>({ type: "none" });
  const [addingLine, setAddingLine] = createSignal<Line>(defaultLine);
  const [svgRect, setSvgRect] = createStore({ ...defaultRectangle });
  const [viewBox, setViewBox] = createStore({ ...defaultRectangle });

  function setAddingLineFrom(x: number, y: number) {
    setAddingLine({ p1: { x, y }, p2: { x, y } });
  }

  function setAddingLineTo(x: number, y: number) {
    setAddingLine({ p1: addingLine().p1, p2: { x, y } });
  }

  function autoRectangle(rect: Rectangle) {
    setZoom(Math.min(svgRect.width / rect.width, svgRect.height / rect.height));
    setViewBox({ x: rect.x, y: rect.y, width: viewBox.width, height: viewBox.height });
  }

  nodeModel;
  edgeModel;

  return {
    toolbar,
    setToolbar,
    zoom,
    setZoom,
    dragType,
    setDragType,
    addingLine,
    setAddingLineFrom,
    setAddingLineTo,
    svgRect,
    setSvgRect,
    autoRectangle,
    viewBox,
    setViewBox,
  };
}
