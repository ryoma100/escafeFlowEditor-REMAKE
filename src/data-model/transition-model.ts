import { createStore, unwrap } from "solid-js/store";
import { createActivityModel } from "./activity-model";
import { ProcessEntity, TransitionEdgeEntity } from "../data-source/data-type";
import { dataSource } from "../data-source/data-source";
import { dataFactory } from "../data-source/data-factory";

export function createTransitionModel({
  activityList,
}: ReturnType<typeof createActivityModel>) {
  let selectedProcess: ProcessEntity = dataSource.project.processes[0];
  const [transitionList, setTransitionList] = createStore<
    TransitionEdgeEntity[]
  >([]);

  function saveTransition() {
    dataSource.findProcess(selectedProcess.id).transitions = [
      ...unwrap(transitionList),
    ];
  }

  function loadTransition(process: ProcessEntity) {
    selectedProcess = process;
    setTransitionList(dataSource.findProcess(process.id).transitions);
  }

  function addTransition(toActivityId: number): TransitionEdgeEntity {
    const fromActivityId = activityList.find((it) => it.selected)!.id;
    const transition = dataFactory.createTransition(
      selectedProcess,
      fromActivityId,
      toActivityId
    );
    setTransitionList([...transitionList, transition]);
    const proxyTransition = transitionList[transitionList.length - 1];
    return proxyTransition;
  }

  return {
    addTransition,
    transitionList,
    setTransitionList,
    saveTransition,
    loadTransition,
  };
}
