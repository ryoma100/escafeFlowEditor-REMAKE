import { createStore } from "solid-js/store";
import { activityModel } from "./activity-model";

let lastTransitionId = 0;
export type TransitionEntity = {
  // not reactive fields
  id: number;
  xpdlId: string;

  // reactive fields
  fromActivityId: number;
  toActivityId: number;
};

export function defaultTransition(): TransitionEntity {
  return {
    id: 0,
    xpdlId: "",
    fromActivityId: 0,
    toActivityId: 0,
  };
}

export function transitionModel({
  activityList,
}: ReturnType<typeof activityModel>) {
  const [transitionList, setTransitionList] = createStore<TransitionEntity[]>(
    []
  );

  function addTransition(toActivityId: number) {
    const fromActivityId = activityList.find((it) => it.selected)!.id;

    lastTransitionId++;
    const entity: TransitionEntity = {
      id: lastTransitionId,
      xpdlId: `newpkg_wp1_tra${lastTransitionId}`,
      fromActivityId,
      toActivityId,
    };
    setTransitionList([...transitionList, entity]);
    return lastTransitionId;
  }

  return { addTransition, transitionList };
}
