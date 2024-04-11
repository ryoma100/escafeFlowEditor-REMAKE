import { Point, Rectangle } from "../data-source/data-type";
import { pointLength } from "./point-utils";

export function intersectRect(r1: Rectangle, r2: Rectangle): boolean {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

export function minLengthOfPointToRect(point: Point, rect: Rectangle): number {
  let radius: number = pointLength(point, { x: rect.x, y: rect.y });
  radius = Math.min(radius, pointLength(point, { x: rect.x + rect.width, y: rect.y }));
  radius = Math.min(
    radius,
    pointLength(point, { x: rect.x + rect.width, y: rect.y + rect.height }),
  );
  radius = Math.min(radius, pointLength(point, { x: rect.x, y: rect.y + rect.height }));
  return radius;
}
