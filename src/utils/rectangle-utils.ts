import { Point, Rectangle } from "@/data-source/data-type";
import { pointLength } from "@/utils/point-utils";

export function containsRect(rect: Rectangle, point: Point): boolean {
  return !(
    point.x < rect.x ||
    rect.x + rect.width < point.x ||
    point.y < rect.y ||
    rect.y + rect.height < point.y
  );
}

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

export function centerPoint(rect: Rectangle): Point {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}
