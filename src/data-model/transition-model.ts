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

  function save() {
    process.transitionEdges = [...transitionList];
  }

  function addTransition(toActivityId: number): TransitionEdge {
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
