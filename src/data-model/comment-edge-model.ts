import { createStore } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { CommentEdgeEntity, ProcessEntity } from "../data-source/data-type";
import { makeCommentModel } from "./comment-model";

export function makeCommentEdgeModel(commentModel: ReturnType<typeof makeCommentModel>) {
  let process: ProcessEntity;
  const [commentEdgeList, setCommentEdgeList] = createStore<CommentEdgeEntity[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setCommentEdgeList(process.commentEdges);
  }

  function save() {
    process.commentEdges = [...commentEdgeList];
  }

  function addCommentEdge(toActivityId: number): CommentEdgeEntity {
    const fromCommentId = commentModel.commentList.find((it) => it.selected)!.id;
    const commentEdge = dataFactory.createCommentEdge(process, fromCommentId, toActivityId);
    setCommentEdgeList([...commentEdgeList, commentEdge]);
    const proxyComment = commentEdgeList[commentEdgeList.length - 1];
    return proxyComment;
  }

  return { load, save, commentEdgeList, addCommentEdge };
}
