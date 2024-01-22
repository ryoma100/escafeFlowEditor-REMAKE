import { createStore } from "solid-js/store";

export type ActvityType = "manual" | "auto" | "hand";

export type ActivityEntity = {
  id: string;
  xpdlId: string;
  type: ActvityType;
  title: string;
  actorId: number;
  x: number;
  y: number;
};

let nextActivityId = 1;

function defaultActivity(): ActivityEntity {
  return {
    id: "act0",
    xpdlId: "",
    type: "manual",
    title: "",
    actorId: 0,
    x: 0,
    y: 0,
  };
}

export function activityModel() {
  const [activityList, setActivityList] = createStore<ActivityEntity[]>([]);

  function addActivity(type: ActvityType, x: number, y: number) {
    const entity: ActivityEntity = {
      id: `act${nextActivityId}`,
      xpdlId: `newpkg_wp1_act${nextActivityId}`,
      type,
      title: "",
      actorId: 0,
      x,
      y,
    };
    nextActivityId++;
    setActivityList([...activityList, entity]);
  }

  return {
    activityList,
    setActivityList,
    addActivity,
  };
}
