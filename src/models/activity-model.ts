import { createStore, produce } from "solid-js/store";

export type ActvityType = "manual" | "auto" | "hand";

export type ActivityEntity = {
  id: string;
  xpdlId: string;
  type: ActvityType;
  title: string;
  actorId: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

let nextActivityId = 1;

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
      width: 100,
      height: 100,
    };
    nextActivityId++;
    setActivityList([...activityList, entity]);
  }

  function moveActivity(id: string, moveX: number, moveY: number) {
    setActivityList(
      (it) => it.id === id,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      })
    );
  }

  function resizeLeft(id: string, movementCX: number) {
    setActivityList(
      (it) => it.id === id,
      produce((it) => {
        if (100 <= it.width - movementCX) {
          it.x = it.x + movementCX / 2;
          it.width = it.width - movementCX;
        }
      })
    );
  }

  function resizeRight(id: string, movementCX: number) {
    setActivityList(
      (it) => it.id === id,
      produce((it) => {
        if (100 <= it.width + movementCX) {
          it.x = it.x + movementCX / 2;
          it.width = it.width + movementCX;
        }
      })
    );
  }

  return {
    activityList,
    setActivityList,
    addActivity,
    moveActivity,
    resizeLeft,
    resizeRight,
  };
}
