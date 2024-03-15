import { createStore, produce } from "solid-js/store";
import { INode, ProcessEntity } from "../data-source/data-type";

export function makeNodeModel() {
  const [nodeList, setNodeList] = createStore<INode[]>([]);

  function load(newProcess: ProcessEntity) {
    setNodeList(newProcess.nodes);
  }

  function save(): INode[] {
    return JSON.parse(JSON.stringify(nodeList));
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
  };
}
