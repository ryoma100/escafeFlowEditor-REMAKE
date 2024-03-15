import { dataFactory } from "../data-source/data-factory";
import { TransitionEdge } from "../data-source/data-type";
import { makeEdgeModel } from "./edge-model";
import { makeNodeModel } from "./node-model";

export function makeTransactionEdgeModel(
  edgeModel: ReturnType<typeof makeEdgeModel>,
  nodeModel: ReturnType<typeof makeNodeModel>,
) {
  function getTransitionEdges(): TransitionEdge[] {
    return edgeModel.edgeList.filter((it) => it.type === "transitionEdge") as TransitionEdge[];
  }

  function addTransitionEdge(toActivityId: number): TransitionEdge | null {
    const fromActivityId = nodeModel.nodeList.find((it) => it.selected)!.id;
    const transitionList = getTransitionEdges();

    if (
      fromActivityId === toActivityId ||
      transitionList.find((it) => it.fromNodeId === fromActivityId)?.toNodeId === toActivityId ||
      transitionList.find((it) => it.toNodeId === toActivityId)?.fromNodeId === fromActivityId
    ) {
      // Exclude duplicate transitions
      return null;
    }

    const transition = dataFactory.createTransitionEdge(
      edgeModel.edgeList,
      fromActivityId,
      toActivityId,
    );
    edgeModel.setEdgeList([...edgeModel.edgeList, transition]);

    return transition;
  }

  return { addTransitionEdge, getTransitionEdges };
}
