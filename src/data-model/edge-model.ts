import { createStore, produce } from "solid-js/store";

import type { NodeModel } from "@/data-model/node-model";
import { deepUnwrap } from "@/data-source/data-factory";
import type { EdgeId, IEdge, ProcessEntity } from "@/data-source/data-type";

export type EdgeModel = ReturnType<typeof makeEdgeModel>;

export function makeEdgeModel(nodeModel: NodeModel) {
  const [edgeList, setEdgeList] = createStore<IEdge[]>([]);

  function load(process: ProcessEntity) {
    setEdgeList(process.edgeList);
  }

  function save(): IEdge[] {
    return deepUnwrap(edgeList);
  }

  function changeSelectEdges(type: "select" | "selectAll" | "toggle" | "clearAll", ids: EdgeId[] = []) {
    setEdgeList(
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
          default:
            const notExpectedValue: never = type;
            throw new Error(notExpectedValue);
        }
      }),
    );
  }

  function changeDisableEdge(type: "disable" | "clearDisable", edgeId: EdgeId) {
    setEdgeList(
      (it) => it.id === edgeId,
      produce((it) => {
        it.disabled = type === "disable";
      }),
    );
  }

  function deleteEdge(edgeId: EdgeId) {
    setEdgeList(edgeList.filter((it) => it.id !== edgeId));
  }

  function deleteSelectedEdge() {
    setEdgeList(
      edgeList.filter(
        (it) => !it.selected && !nodeModel.getNode(it.fromNodeId).selected && !nodeModel.getNode(it.toNodeId).selected,
      ),
    );
  }

  function selectedEdges() {
    return edgeList.filter((it) => it.selected);
  }

  function addEdge<T extends IEdge>(edge: T): T {
    setEdgeList([...edgeList, edge]);
    return edge;
  }

  return {
    load,
    save,
    edgeList,
    setEdgeList,
    changeSelectEdges,
    deleteSelectedEdge,
    selectedEdges,
    addEdge,
    deleteEdge,
    changeDisableEdge,
  };
}
