import { makeEdgeModel } from "@/data-model/edge-model";
import { makeNodeModel } from "@/data-model/node-model";
import { dataFactory } from "@/data-source/data-factory";
import { CommentEdge, EndEdge, NodeId, StartEdge } from "@/data-source/data-type";

export function makeExtendEdgeModel(
  edgeModel: ReturnType<typeof makeEdgeModel>,
  nodeModel: ReturnType<typeof makeNodeModel>,
) {
  function addCommentEdge(toActivityId: NodeId): CommentEdge {
    const fromCommentId = nodeModel.nodeList.find((it) => it.selected)!.id;
    const edge = dataFactory.createCommentEdge(edgeModel.edgeList, fromCommentId, toActivityId);
    return edgeModel.addEdge(edge);
  }

  function addStartEdge(toActivityId: NodeId): StartEdge {
    const fromStartId = nodeModel.nodeList.find((it) => it.selected)!.id;
    const edge = dataFactory.createStartEdge(edgeModel.edgeList, fromStartId, toActivityId);
    return edgeModel.addEdge(edge);
  }

  function addEndEdge(toEndNodeId: NodeId): EndEdge {
    const fromActivityId = nodeModel.nodeList.find((it) => it.selected)!.id;
    const edge = dataFactory.createEndEdge(edgeModel.edgeList, fromActivityId, toEndNodeId);
    return edgeModel.addEdge(edge);
  }

  return { addCommentEdge, addStartEdge, addEndEdge };
}
