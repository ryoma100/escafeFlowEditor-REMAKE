import { Point } from "../data-source/data-type";

export function pointLength(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
