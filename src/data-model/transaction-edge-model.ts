import { produce } from "solid-js/store";

import { i18nEnDict } from "@/constants/i18n";
import { ActivityNodeModel } from "@/data-model/activity-node-model";
import { EdgeModel } from "@/data-model/edge-model";
import { dataFactory } from "@/data-source/data-factory";
import { NodeId, TransitionEdge } from "@/data-source/data-type";

export type TransitionEdgeModel = ReturnType<typeof makeTransactionEdgeModel>;

export function makeTransactionEdgeModel(
  edgeModel: EdgeModel,
  activityNodeModel: ActivityNodeModel,
) {
  function getTransitionEdges(): TransitionEdge[] {
    return edgeModel.edgeList.filter((it) => it.type === "transitionEdge") as TransitionEdge[];
  }

  function addTransitionEdge(fromActivityId: NodeId, toActivityId: NodeId): TransitionEdge | null {
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

    activityNodeModel.updateJoinType(
      transition.toNodeId,
      getTransitionEdges().filter((it) => it.toNodeId === transition.toNodeId).length,
    );
    activityNodeModel.updateSplitType(
      transition.fromNodeId,
      getTransitionEdges().filter((it) => it.fromNodeId === transition.fromNodeId).length,
    );

    return transition;
  }

  function updateTransitionEdge(transition: TransitionEdge): keyof typeof i18nEnDict | undefined {
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

    edgeModel.setEdgeList(
      (it) => it.id === transition.id,
      produce((it) => {
        if (it.type === "transitionEdge") {
          it.xpdlId = transition.xpdlId;
          it.ognl = transition.ognl;
        }
      }),
    );
  }

  return { addTransitionEdge, getTransitionEdges, updateTransitionEdge, edgeModel };
}
