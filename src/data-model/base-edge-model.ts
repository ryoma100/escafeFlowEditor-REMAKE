import { createStore, produce } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import {
  CommentEdge,
  EndEdge,
  IEdge,
  ProcessEntity,
  StartEdge,
  TransitionEdge,
} from "../data-source/data-type";
import { ActivityNodeModel } from "./activity-node-model";
import { BaseNodeModel } from "./base-node-model";

export type BaseEdgeModel = ReturnType<typeof makeBaseEdgeModel>;

export function makeBaseEdgeModel(
  baseNodeModel: BaseNodeModel,
  activityNodeModel: ActivityNodeModel,
) {
  const [edgeList, setEdgeList] = createStore<IEdge[]>([]);

  function load(process: ProcessEntity) {
    setEdgeList(process.edges);
  }

  function save(): (TransitionEdge | CommentEdge | StartEdge | EndEdge)[] {
    return JSON.parse(JSON.stringify(edgeList));
  }

  function setSelectedEdges(
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
          !baseNodeModel.getNode(it.fromNodeId).selected &&
          !baseNodeModel.getNode(it.toNodeId).selected,
      ),
    );
  }

  function selectedEdges() {
    return edgeList.filter((it) => it.selected);
  }

  function addTransitionEdge(processXpdlId: string, toActivityId: number): TransitionEdge | null {
    const fromActivityId = baseNodeModel.nodeList.find((it) => it.selected)!.id;
    const transitionList: TransitionEdge[] = edgeList.filter(
      (it) => it.type === "transitionEdge",
    ) as TransitionEdge[]; // TODO:type

    if (
      fromActivityId === toActivityId ||
      transitionList.find((it) => it.fromNodeId === fromActivityId)?.toNodeId === toActivityId ||
      transitionList.find((it) => it.toNodeId === toActivityId)?.fromNodeId === fromActivityId
    ) {
      // Exclude duplicate transitions
      return null;
    }

    const transition = dataFactory.createTransition(
      processXpdlId,
      edgeList,
      fromActivityId,
      toActivityId,
    );
    setEdgeList([...edgeList, transition]);

    activityNodeModel.updateJoinType(
      toActivityId,
      transitionList.filter((it) => it.toNodeId === toActivityId).length,
    );
    activityNodeModel.updateSplitType(
      fromActivityId,
      transitionList.filter((it) => it.fromNodeId === fromActivityId).length,
    );

    return transition;
  }

  function addCommentEdge(toActivityId: number): CommentEdge {
    const fromCommentId = baseNodeModel.nodeList.find((it) => it.selected)!.id;
    const edgeId = edgeList.reduce((maxId, it) => Math.max(it.id, maxId), 0) + 1;
    const edge = dataFactory.createCommentEdge(edgeId, fromCommentId, toActivityId);
    setEdgeList([...edgeList, edge]);

    return edge;
  }

  function addStartEdge(toActivityId: number): StartEdge {
    const fromStartId = baseNodeModel.nodeList.find((it) => it.selected)!.id;
    const edgeId = edgeList.reduce((maxId, it) => Math.max(it.id, maxId), 0) + 1;
    const edge = dataFactory.createStartEdge(edgeId, fromStartId, toActivityId);
    setEdgeList([...edgeList, edge]);

    return edge;
  }

  function addEndEdge(toEndNodeId: number): EndEdge {
    const fromActivityId = baseNodeModel.nodeList.find((it) => it.selected)!.id;
    const edgeId = edgeList.reduce((maxId, it) => Math.max(it.id, maxId), 0) + 1;
    const edge = dataFactory.createEndEdge(edgeId, fromActivityId, toEndNodeId);
    setEdgeList([...edgeList, edge]);

    return edge;
  }

  return {
    load,
    save,
    edgeList,
    setEdgeList,
    setSelectedEdges,
    deleteSelectedEdge,
    selectedEdges,
    addTransitionEdge,
    addCommentEdge,
    addStartEdge,
    addEndEdge,
  };
}
