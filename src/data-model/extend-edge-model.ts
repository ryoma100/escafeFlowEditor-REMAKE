import { EdgeModel } from "@/data-model/edge-model";
import { dataFactory } from "@/data-source/data-factory";
import { CommentEdge, EndEdge, INode, StartEdge } from "@/data-source/data-type";

export type ExtendEdgeModel = ReturnType<typeof makeExtendEdgeModel>;

export function makeExtendEdgeModel(edgeModel: EdgeModel) {
  function addCommentEdge(fromComment: INode, toActivity: INode): CommentEdge | null {
    const edge = dataFactory.createCommentEdge(edgeModel.edgeList, fromComment.id, toActivity.id);
    return edgeModel.addEdge(edge);
  }

  function addStartEdge(fromStart: INode, toActivity: INode): StartEdge | null {
    const edge = dataFactory.createStartEdge(edgeModel.edgeList, fromStart.id, toActivity.id);
    return edgeModel.addEdge(edge);
  }

  function addEndEdge(fromActivity: INode, toEndNode: INode): EndEdge | null {
    const edge = dataFactory.createEndEdge(edgeModel.edgeList, fromActivity.id, toEndNode.id);
    return edgeModel.addEdge(edge);
  }

  return { edgeModel, addCommentEdge, addStartEdge, addEndEdge };
}
