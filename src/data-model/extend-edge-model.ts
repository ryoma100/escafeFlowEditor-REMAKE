import { EdgeModel } from "@/data-model/edge-model";
import { dataFactory } from "@/data-source/data-factory";
import { CommentEdge, EndEdge, NodeId, StartEdge } from "@/data-source/data-type";

export type ExtendEdgeModel = ReturnType<typeof makeExtendEdgeModel>;

export function makeExtendEdgeModel(edgeModel: EdgeModel) {
  function addCommentEdge(fromCommentId: NodeId, toActivityId: NodeId): CommentEdge | null {
    if (edgeModel.edgeList.some((it) => it.toNodeId === toActivityId)) return null;

    const edge = dataFactory.createCommentEdge(edgeModel.edgeList, fromCommentId, toActivityId);
    return edgeModel.addEdge(edge);
  }

  function addStartEdge(fromStartId: NodeId, toActivityId: NodeId): StartEdge | null {
    if (edgeModel.edgeList.some((it) => it.toNodeId === toActivityId)) return null;

    const edge = dataFactory.createStartEdge(edgeModel.edgeList, fromStartId, toActivityId);
    return edgeModel.addEdge(edge);
  }

  function addEndEdge(fromActivityId: NodeId, toEndNodeId: NodeId): EndEdge | null {
    if (edgeModel.edgeList.some((it) => it.fromNodeId === fromActivityId)) return null;

    const edge = dataFactory.createEndEdge(edgeModel.edgeList, fromActivityId, toEndNodeId);
    return edgeModel.addEdge(edge);
  }

  return { edgeModel, addCommentEdge, addStartEdge, addEndEdge };
}
