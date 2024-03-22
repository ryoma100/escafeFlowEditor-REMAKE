import { createStore, produce } from "solid-js/store";
import { deepCopy } from "../data-source/data-factory";
import {
  CommentEdge,
  EndEdge,
  IEdge,
  ProcessEntity,
  StartEdge,
  TransitionEdge,
} from "../data-source/data-type";
import { makeNodeModel } from "./node-model";

export function makeEdgeModel(nodeModel: ReturnType<typeof makeNodeModel>) {
  const [edgeList, setEdgeList] = createStore<IEdge[]>([]);

  function load(process: ProcessEntity) {
    setEdgeList(process.edges);
  }

  function save(): (TransitionEdge | CommentEdge | StartEdge | EndEdge)[] {
    return deepCopy(edgeList);
  }

  function changeSelectEdges(
    type: "select" | "selectAll" | "toggle" | "clearAll",
    ids: number[] = [],
  ) {
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
        }
      }),
    );
  }

  function deleteSelectedEdge() {
    setEdgeList(
      edgeList.filter(
        (it) =>
          !it.selected &&
          !nodeModel.getNode(it.fromNodeId).selected &&
          !nodeModel.getNode(it.toNodeId).selected,
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
  };
}
