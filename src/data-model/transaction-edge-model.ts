import { enDict } from "@/constants/i18n-en";
import { makeEdgeModel } from "@/data-model/edge-model";
import { makeNodeModel } from "@/data-model/node-model";
import { dataFactory } from "@/data-source/data-factory";
import { TransitionEdge } from "@/data-source/data-type";

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

  function updateTransitionEdge(transition: TransitionEdge): keyof typeof enDict | undefined {
    if (
      edgeModel.edgeList.some(
        (it) =>
          it.type === "transitionEdge" &&
          it.id !== transition.id &&
          it.xpdlId === transition.xpdlId,
      )
    ) {
      return "idExists";
    }

    edgeModel.setEdgeList([...edgeModel.edgeList, transition]);
  }

  return { addTransitionEdge, getTransitionEdges, updateTransitionEdge };
}
