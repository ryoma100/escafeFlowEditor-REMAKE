import { createStore, produce } from "solid-js/store";

import { defaultRectangle, GRID_SPACING } from "@/constants/app-const";
import { makeDiagramModel } from "@/data-model/diagram-model";
import { deepUnwrap } from "@/data-source/data-factory";
import { INode, Point, ProcessEntity, Rectangle } from "@/data-source/data-type";
import { rotatePoint } from "@/utils/point-utils";

export type NodeModel = ReturnType<typeof makeNodeModel>;

export function makeNodeModel(diagramModel: ReturnType<typeof makeDiagramModel>) {
  const [nodeList, setNodeList] = createStore<INode[]>([]);

  function load(newProcess: ProcessEntity) {
    setNodeList(newProcess.nodeList);

    // wait ResizeObserver
    setTimeout(() => resetGraphRect(), 0);
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

  function moveSelectedNodes(moveX: number, moveY: number) {
    setNodeList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      }),
    );
    resetGraphRect();
  }

  function scaleSelectedNodes(basePoint: Point, moveX: number, moveY: number) {
    setNodeList(
      (it) => it.selected,
      produce((it) => {
        const centerPoint: Point = { x: it.x + it.width / 2, y: it.y + it.height / 2 };
        it.x += centerPoint.x > basePoint.x ? moveX : -moveX;
        it.y += centerPoint.y > basePoint.y ? moveY : -moveY;
      }),
    );
    resetGraphRect();
  }

  function rotateSelectedNodes(basePoint: Point, moveX: number, moveY: number) {
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
    resetGraphRect();
  }

  function getNode(nodeId: number): INode {
    const node = nodeList.find((it) => it.id === nodeId);
    if (node == null) {
      throw new Error(`getNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function addNode<T extends INode>(node: T) {
    setNodeList([...nodeList, node]);

    // wait ResizeObserver
    setTimeout(() => resetGraphRect(), 0);
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

  function resetGraphRect() {
    diagramModel.changeGraphRect(computeMaxRectangle(nodeList));
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
    moveSelectedNodes,
    changeTopLayer,
    scaleSelectedNodes,
    rotateSelectedNodes,
    resetGraphRect,
  };
}

export function computeMaxRectangle(nodes: INode[]): Rectangle {
  if (nodes.length === 0) return defaultRectangle;

  const area = nodes.reduce(
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
    x: area.left - GRID_SPACING * 1.25,
    y: area.top - GRID_SPACING * 1.25,
    width: area.right - area.left + GRID_SPACING * 2.5,
    height: area.bottom - area.top + GRID_SPACING * 2.5,
  };
}
