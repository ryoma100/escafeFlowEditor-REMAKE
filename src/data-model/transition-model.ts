import { createStore } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { ProcessEntity, TransitionEdgeEntity } from "../data-source/data-type";
import { makeActivityModel } from "./activity-model";

export function makeTransitionModel(activityModel: ReturnType<typeof makeActivityModel>) {
  let process: ProcessEntity;
  const [transitionList, setTransitionList] = createStore<TransitionEdgeEntity[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setTransitionList(process.transitions);
  }

  function save() {
    process.transitions = [...transitionList];
  }

  function addTransition(toActivityId: number): TransitionEdgeEntity {
    const fromActivityId = activityModel.activityList.find((it) => it.selected)!.id;
    const transition = dataFactory.createTransition(process, fromActivityId, toActivityId);
    setTransitionList([...transitionList, transition]);
    const proxyTransition = transitionList[transitionList.length - 1];
    return proxyTransition;
  }

  return {
    load,
    save,
    addTransition,
    transitionList,
    setTransitionList,
  };
}
