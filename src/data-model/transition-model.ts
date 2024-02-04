import { createStore, unwrap } from "solid-js/store";
import { createActivityModel } from "./activity-model";
import { ProcessEntity, TransitionEntity } from "../data-source/data-type";
import { dataSource } from "../data-source/data-source";
import { dataFactory } from "../data-source/data-factory";

export function createTransitionModel({
  activityList,
}: ReturnType<typeof createActivityModel>) {
  let selectedProcess: ProcessEntity = dataSource.pkg.processes[0];
  const [transitionList, setTransitionList] = createStore<TransitionEntity[]>(
    []
  );

  function saveTransition() {
    dataSource.findProcess(selectedProcess.id).transitions = [
      ...unwrap(transitionList),
    ];
  }

  function loadTransition(process: ProcessEntity) {
    selectedProcess = process;
    setTransitionList(dataSource.findProcess(process.id).transitions);
  }

  function addTransition(toActivityId: number) {
    const fromActivityId = activityList.find((it) => it.selected)!.id;
    const transition = dataFactory.createTransition(
      selectedProcess,
      fromActivityId,
      toActivityId
    );
    setTransitionList([...transitionList, transition]);
    return transition.id;
  }

  return {
    addTransition,
    transitionList,
    setTransitionList,
    saveTransition,
    loadTransition,
  };
}
