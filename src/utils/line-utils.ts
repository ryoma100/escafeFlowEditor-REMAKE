import { Line, Point, Rectangle } from "../data-source/data-type";

const ACCURACY: number = 0.000000000001;

export function intersectionLinePair(line1: Line, line2: Line): Point | null {
  const a1: Point = line1.p1;
  const a2: Point = line1.p2;
  const b1: Point = line2.p1;
  const b2: Point = line2.p2;

  // ax+by=c
  const a: number = a1.y - a2.y;
  const b: number = a2.x - a1.x;
  const c: number = a2.x * a1.y - a2.y * a1.x;

  // dx+ey=f
  const d: number = b1.y - b2.y;
  const e: number = b2.x - b1.x;
  const f: number = b2.x * b1.y - b2.y * b1.x;

  const denominator: number = b * d - a * e;
  if (Math.abs(denominator) < ACCURACY) {
    return null;
  }
  const x: number = (b * f - c * e) / denominator;
  const y: number = (c * d - a * f) / denominator;

  // line segment check
  if (x < Math.min(a1.x, a2.x) || Math.max(a1.x, a2.x) < x) {
    return null;
  }
  if (x < Math.min(b1.x, b2.x) || Math.max(b1.x, b2.x) < x) {
    return null;
  }
  if (y < Math.min(a1.y, a2.y) || Math.max(a1.y, a2.y) < y) {
    return null;
  }
  if (y < Math.min(b1.y, b2.y) || Math.max(b1.y, b2.y) < y) {
    return null;
  }

  return { x, y };
}

export function intersectionLineRectangle(line: Line, rect: Rectangle): Point | null {
  const topLeft: Point = { x: rect.x, y: rect.y };
  const topRight: Point = { x: rect.x + rect.width - 1, y: rect.y };
  const bottomLeft: Point = { x: rect.x, y: rect.y + rect.height - 1 };
  const bottomRight: Point = { x: rect.x + rect.width - 1, y: rect.y + rect.height - 1 };

  const lines: Line[] = [
    { p1: topLeft, p2: topRight },
    { p1: topRight, p2: bottomRight },
    { p1: bottomLeft, p2: bottomRight },
    { p1: topLeft, p2: bottomLeft },
  ];

  for (const it of lines) {
    const point = intersectionLinePair(line, it);
    if (point) {
      return point;
    }
  }

  return null;
}

export function computeLine(rect1: Rectangle, rect2: Rectangle, line: Line): Line {
  const p1 = intersectionLineRectangle(line, rect1) ?? line.p1;
  const p2 = intersectionLineRectangle(line, rect2) ?? line.p2;
  return { p1, p2 };
}
