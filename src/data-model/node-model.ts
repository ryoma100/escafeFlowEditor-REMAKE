import { createStore, produce } from "solid-js/store";
import { deepUnwrap } from "../data-source/data-factory";
import { INode, Point, ProcessEntity } from "../data-source/data-type";
import { rotatePoint } from "../utils/point-utils";

export function makeNodeModel() {
  const [nodeList, setNodeList] = createStore<INode[]>([]);

  function load(newProcess: ProcessEntity) {
    setNodeList(newProcess.nodes);
  }

  function save(): INode[] {
    return deepUnwrap(nodeList);
  }

  function changeSelectNodes(
    type: "select" | "selectAll" | "toggle" | "clearAll",
    ids: number[] = [],
  ) {
    setNodeList(
      (it) => type !== "toggle" || (type === "toggle" && ids.includes(it.id)),
      produce((it) => {
        switch (type) {
          case "select":
            it.selected = ids.includes(it.id);
            break;
          case "selectAll":
            it.selected = true;
            break;
          case "toggle":
            it.selected = !it.selected;
            break;
          case "clearAll":
            it.selected = false;
            break;
        }
      }),
    );
  }

  function moveSelectedNodesPosition(moveX: number, moveY: number) {
    setNodeList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      }),
    );
  }

  function scaleSelectedNodesPosition(basePoint: Point, moveX: number, moveY: number) {
    setNodeList(
      (it) => it.selected,
      produce((it) => {
        const centerPoint: Point = { x: it.x + it.width / 2, y: it.y + it.height / 2 };
        it.x += centerPoint.x > basePoint.x ? moveX : -moveX;
        it.y += centerPoint.y > basePoint.y ? moveY : -moveY;
      }),
    );
  }

  function rotateSelectedNodesPosition(basePoint: Point, moveX: number, moveY: number) {
    const delta: number = (100 + moveY) / 100;
    const angle: number = -moveX;

    setNodeList(
      (it) => it.selected,
      produce((it) => {
        const centerPoint: Point = { x: it.x + it.width / 2, y: it.y + it.height / 2 };
        const point: Point = { x: it.x, y: it.y };
        if (centerPoint.y > basePoint.y) {
          point.y = basePoint.y + (point.y - basePoint.y) * delta;
        } else {
          point.y = basePoint.y - (basePoint.y - point.y) * delta;
        }
        if (centerPoint.x > basePoint.x) {
          point.x = basePoint.x + (point.x - basePoint.x) * delta;
        } else {
          point.x = basePoint.x - (basePoint.x - point.x) * delta;
        }
        const newPoint: Point = rotatePoint(basePoint, angle, point);
        it.x = newPoint.x;
        it.y = newPoint.y;
      }),
    );
  }

  function getNode(nodeId: number): INode {
    const node = nodeList.find((it) => it.id === nodeId);
    if (node == null) {
      throw new Error(`getNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function addNode<T extends INode>(node: T): T {
    setNodeList([...nodeList, node]);
    return node;
  }

  function deleteSelectedNodes() {
    setNodeList(nodeList.filter((it) => !it.selected));
  }

  function getSelectedNodes() {
    return nodeList.filter((it) => it.selected);
  }

  function changeTopLayer(id: number) {
    const target = getNode(id);
    const listWithoutTarget = nodeList.filter((it) => it.id !== id);
    setNodeList([...listWithoutTarget, target]);
  }

  function computeMaxRectangle() {
    if (nodeList.length === 0) return null;

    const area = nodeList.reduce(
      (rect, node) => {
        return {
          left: Math.min(rect.left, node.x),
          top: Math.min(rect.top, node.y),
          right: Math.max(rect.right, node.x + node.width),
          bottom: Math.max(rect.bottom, node.y + node.height),
        };
      },
      {
        left: Number.MAX_SAFE_INTEGER,
        top: Number.MAX_SAFE_INTEGER,
        right: Number.MIN_SAFE_INTEGER,
        bottom: Number.MIN_SAFE_INTEGER,
      },
    );

    return {
      x: area.left,
      y: area.top,
      width: area.right - area.left,
      height: area.bottom - area.top,
    };
  }

  return {
    load,
    save,
    nodeList,
    setNodeList,
    addNode,
    getNode,
    getSelectedNodes,
    changeSelectNodes,
    deleteSelectedNodes,
    moveSelectedNodesPosition,
    changeTopLayer,
    computeMaxRectangle,
    scaleSelectedNodesPosition,
    rotateSelectedNodesPosition,
  };
}
