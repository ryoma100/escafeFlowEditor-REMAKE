import { createStore } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { CommentEdge, EndEdge, ProcessEntity, StartEdge } from "../data-source/data-type";
import { makeOtherNodeModel } from "./other-node-model";

export function makeOtherEdgeModel(otherNodeModel: ReturnType<typeof makeOtherNodeModel>) {
  let process: ProcessEntity;
  const [otherEdgeList, setOtherEdgeList] = createStore<(CommentEdge | StartEdge | EndEdge)[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setOtherEdgeList(process.otherEdges);
  }

  function save() {
    process.otherEdges = [...otherEdgeList];
  }

  function addCommentEdge(toActivityId: number): CommentEdge {
    const fromCommentId = otherNodeModel.otherNodeList.find((it) => it.selected)!.id;
    const edge = dataFactory.createCommentEdge(process, fromCommentId, toActivityId);
    setOtherEdgeList([...otherEdgeList, edge]);
    const proxyEdge = otherEdgeList[otherEdgeList.length - 1];
    return proxyEdge as CommentEdge;
  }

  return {
    load,
    save,
    otherEdgeList,
    addCommentEdge,
  };
}
