import { Circle, Line, Point, Rectangle } from "../data-source/data-type";

export const ACTIVITY_MIN_WIDTH = 100;
export const ACTIVITY_MIN_HEIGHT = 80;

export const NORMAL_ICON_SIZE = 48;

export const defaultPoint: Point = { x: 0, y: 0 };
export const defaultLine: Line = { p1: defaultPoint, p2: defaultPoint };
export const defaultRectangle: Rectangle = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
export const defaultCircle: Circle = { cx: 0, cy: 0, r: 0 };
