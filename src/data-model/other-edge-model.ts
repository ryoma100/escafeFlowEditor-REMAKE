import { createStore } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { CommentEdge, EndEdge, ProcessEntity, StartEdge } from "../data-source/data-type";
import { makeActivityModel } from "./activity-model";
import { makeOtherNodeModel } from "./other-node-model";

export function makeOtherEdgeModel(
  otherNodeModel: ReturnType<typeof makeOtherNodeModel>,
  activityModel: ReturnType<typeof makeActivityModel>,
) {
  let process: ProcessEntity;
  const [otherEdgeList, setOtherEdgeList] = createStore<(CommentEdge | StartEdge | EndEdge)[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setOtherEdgeList(process.otherEdges);
  }

  function sync() {
    process.otherEdges = [...otherEdgeList];
  }

  function addCommentEdge(toActivityId: number): CommentEdge {
    const fromCommentId = otherNodeModel.otherNodeList.find((it) => it.selected)!.id;
    const edge = dataFactory.createCommentEdge(process, fromCommentId, toActivityId);
    setOtherEdgeList([...otherEdgeList, edge]);
    return edge;
  }

  function addStartEdge(toActivityId: number): StartEdge {
    const fromStartId = otherNodeModel.otherNodeList.find((it) => it.selected)!.id;
    const edge = dataFactory.createStartEdge(process, fromStartId, toActivityId);
    setOtherEdgeList([...otherEdgeList, edge]);
    return edge;
  }

  function addEndEdge(toEndNodeId: number): EndEdge {
    const fromActivityId = activityModel.activityList.find((it) => it.selected)!.id;
    const edge = dataFactory.createEndEdge(process, fromActivityId, toEndNodeId);
    setOtherEdgeList([...otherEdgeList, edge]);
    return edge;
  }

  return {
    load,
    sync,
    otherEdgeList,
    addCommentEdge,
    addStartEdge,
    addEndEdge,
    setOtherEdgeList,
  };
}
