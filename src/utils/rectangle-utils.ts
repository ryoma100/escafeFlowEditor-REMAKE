import { Rectangle } from "../data-source/data-type";

export function intersectRect(r1: Rectangle, r2: Rectangle): boolean {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.width < r1.y
  );
}
