import { createStore } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { ProcessEntity, TransitionEdge } from "../data-source/data-type";
import { makeActivityModel } from "./activity-model";

export function makeTransitionModel(activityModel: ReturnType<typeof makeActivityModel>) {
  let process: ProcessEntity;
  const [transitionList, setTransitionList] = createStore<TransitionEdge[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setTransitionList(process.transitionEdges);
  }

  function sync() {
    process.transitionEdges = [...transitionList];
  }

  function addTransition(toActivityId: number): TransitionEdge | null {
    const fromActivityId = activityModel.activityList.find((it) => it.selected)!.id;

    // Exclude duplicate transitions
    if (
      fromActivityId === toActivityId ||
      transitionList.find((it) => it.fromActivityId === fromActivityId)?.toActivityId ===
        toActivityId ||
      transitionList.find((it) => it.toActivityId === toActivityId)?.fromActivityId ===
        fromActivityId
    )
      return null;

    const transition = dataFactory.createTransition(process, fromActivityId, toActivityId);
    setTransitionList([...transitionList, transition]);
    activityModel.updateJoinType(
      toActivityId,
      transitionList.filter((it) => it.toActivityId === toActivityId).length,
    );
    activityModel.updateSplitType(
      fromActivityId,
      transitionList.filter((it) => it.fromActivityId === fromActivityId).length,
    );

    return transition;
  }

  return {
    load,
    sync,
    addTransition,
    transitionList,
    setTransitionList,
  };
}
