import { EdgeModel } from "@/data-model/edge-model";
import { dataFactory } from "@/data-source/data-factory";
import { CommentEdge, EndEdge, INode, StartEdge } from "@/data-source/data-type";

export type ExtendEdgeModel = ReturnType<typeof makeExtendEdgeModel>;

export function makeExtendEdgeModel(edgeModel: EdgeModel) {
  function addCommentEdge(fromNode: INode, toNode: INode): CommentEdge | null {
    if (edgeModel.edgeList.some((it) => it.fromNodeId === fromNode.id && it.toNodeId === toNode.id))
      return null;

    const edge = dataFactory.createCommentEdge(edgeModel.edgeList, fromNode.id, toNode.id);
    return edgeModel.addEdge(edge);
  }

  function addStartEdge(fromNode: INode, toNode: INode): StartEdge | null {
    if (edgeModel.edgeList.some((it) => fromNode.id === it.fromNodeId && it.toNodeId === toNode.id))
      return null;

    const edge = dataFactory.createStartEdge(edgeModel.edgeList, fromNode.id, toNode.id);
    return edgeModel.addEdge(edge);
  }

  function addEndEdge(fromNode: INode, toNode: INode): EndEdge | null {
    if (
      edgeModel.edgeList.some(
        (it) =>
          it.fromNodeId === fromNode.id && (it.toNodeId === toNode.id || toNode.type === "endNode"),
      )
    )
      return null;

    const edge = dataFactory.createEndEdge(edgeModel.edgeList, fromNode.id, toNode.id);
    return edgeModel.addEdge(edge);
  }

  return { edgeModel, addCommentEdge, addStartEdge, addEndEdge };
}
