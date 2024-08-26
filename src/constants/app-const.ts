import { Circle, Line, Point, Rectangle, Size } from "@/data-source/data-type";

export const ACTIVITY_MIN_WIDTH = 88;
export const ACTIVITY_MIN_HEIGHT = 72;
export const START_END_WIDTH = 32;
export const START_END_HEIGHT = 32;

export const GRID_SPACING = 32;

export const NORMAL_ICON_SIZE = 40;

export const defaultPoint: Point = { x: 0, y: 0 };
export const defaultLine: Line = { p1: defaultPoint, p2: defaultPoint };
export const defaultSize: Size = { width: 0, height: 0 };
export const defaultRectangle: Rectangle = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
export const defaultCircle: Circle = { cx: 0, cy: 0, r: 0 };
