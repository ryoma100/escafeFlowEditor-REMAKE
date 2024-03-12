import { createStore, produce } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import {
  CommentEdge,
  EndEdge,
  ProcessEntity,
  StartEdge,
  TransitionEdge,
} from "../data-source/data-type";
import { makeActivityModel } from "./activity-model";
import { makeOtherNodeModel } from "./other-node-model";

export function makeBaseEdgeModel(
  activityModel: ReturnType<typeof makeActivityModel>,
  otherNodeModel: ReturnType<typeof makeOtherNodeModel>,
) {
  const [edgeList, setEdgeList] = createStore<
    (TransitionEdge | CommentEdge | StartEdge | EndEdge)[]
  >([]);

  function load(process: ProcessEntity) {
    setEdgeList(process.edges);
  }

  function save(): (TransitionEdge | CommentEdge | StartEdge | EndEdge)[] {
    return JSON.parse(JSON.stringify(edgeList));
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

  function removeSelectedEdge() {
    setEdgeList(edgeList.filter((it) => !it.selected));
  }

  function selectedEdges() {
    return edgeList.filter((it) => it.selected);
  }

  function addTransitionEdge(processXpdlId: string, toActivityId: number): TransitionEdge | null {
    const fromActivityId = activityModel.activityList.find((it) => it.selected)!.id;
    const transitionList: TransitionEdge[] = edgeList.filter(
      (it) => it.type === "transitionEdge",
    ) as TransitionEdge[]; // TODO:type

    if (
      fromActivityId === toActivityId ||
      transitionList.find((it) => it.fromActivityId === fromActivityId)?.toActivityId ===
        toActivityId ||
      transitionList.find((it) => it.toActivityId === toActivityId)?.fromActivityId ===
        fromActivityId
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

    activityModel.updateJoinType(
      toActivityId,
      transitionList.filter((it) => it.toActivityId === toActivityId).length,
    );
    activityModel.updateSplitType(
      fromActivityId,
      transitionList.filter((it) => it.fromActivityId === fromActivityId).length,
    );

    return transition;
  }

  function addCommentEdge(toActivityId: number): CommentEdge {
    const fromCommentId = otherNodeModel.otherNodeList.find((it) => it.selected)!.id;
    const edgeId = edgeList.reduce((maxId, it) => Math.max(it.id, maxId), 0) + 1;
    const edge = dataFactory.createCommentEdge(edgeId, fromCommentId, toActivityId);
    setEdgeList([...edgeList, edge]);

    return edge;
  }

  function addStartEdge(toActivityId: number): StartEdge {
    const fromStartId = otherNodeModel.otherNodeList.find((it) => it.selected)!.id;
    const edgeId = edgeList.reduce((maxId, it) => Math.max(it.id, maxId), 0) + 1;
    const edge = dataFactory.createStartEdge(edgeId, fromStartId, toActivityId);
    setEdgeList([...edgeList, edge]);

    return edge;
  }

  function addEndEdge(toEndNodeId: number): EndEdge {
    const fromActivityId = activityModel.activityList.find((it) => it.selected)!.id;
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
    changeSelectEdges,
    removeSelectedEdge,
    selectedEdges,
    addTransitionEdge,
    addCommentEdge,
    addStartEdge,
    addEndEdge,
  };
}
