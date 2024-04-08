import { Point } from "../data-source/data-type";

export function pointLength(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

export function rotatePoint(center: Point, angle: number, target: Point): Point {
  const rad: number = (angle * Math.PI) / 180.0;
  let dx: number = target.x - center.x;
  let dy: number = center.y - target.y;
  const dist: number = Math.sqrt(dx * dx + dy * dy);
  if (dist != 0.0) {
    let drad: number = Math.atan2(dy, dx);
    drad -= Math.PI / 2.0;
    drad += rad;
    const ddx: number = Math.sin(drad) * dist;
    const ddy: number = Math.cos(drad) * dist;
    dx = -Math.round(ddx);
    dy = Math.round(ddy);
  }
  return { x: dx + center.x, y: center.y - dy };
}
