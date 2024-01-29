import { createStore, produce } from "solid-js/store";

export type ActvityType = "manual" | "auto" | "hand";

let lastActivityId = 0;
export type ActivityEntity = {
  // not reactive fields
  id: number;
  xpdlId: string;

  // reactive fileds
  type: ActvityType;
  actorId: number;
  title: string;
  cx: number;
  cy: number;
  width: number;
  selected: boolean;
};

export function defaultActivity(): ActivityEntity {
  return {
    id: 0,
    xpdlId: "",
    type: "auto",
    actorId: 0,
    title: "",
    cx: 0,
    cy: 0,
    width: 0,
    selected: false,
  };
}

export function activityModel() {
  const [activityList, setActivityList] = createStore<ActivityEntity[]>([]);

  function addActivity(type: ActvityType, x: number, y: number): number {
    lastActivityId++;
    const entity: ActivityEntity = {
      id: lastActivityId,
      xpdlId: `newpkg_wp1_act${lastActivityId}`,
      type,
      actorId: 1,
      title: `アクティビティ ${lastActivityId} アクティビティ`,
      cx: x,
      cy: y,
      width: 100,
      selected: true,
    };
    setActivityList([...activityList, entity]);
    return lastActivityId;
  }

  function moveSelectedActivities(moveX: number, moveY: number) {
    setActivityList(
      (it) => it.selected,
      produce((it) => {
        it.cx += moveX;
        it.cy += moveY;
      })
    );
  }

  function selectActivities(ids: number[]) {
    setActivityList(
      () => true,
      produce((it) => {
        const selected = ids.includes(it.id);
        if (it.selected !== selected) {
          it.selected = selected;
        }
      })
    );
  }

  function toggleSelectActivity(id: number) {
    setActivityList(
      (it) => it.id === id,
      produce((it) => {
        it.selected = !it.selected;
      })
    );
  }

  function layerTopActivity(id: number) {
    const target = activityList.find((it) => it.id === id)!;
    const listWithoutTarget = activityList.filter((it) => it.id !== id);
    setActivityList([...listWithoutTarget, target]);
  }

  function resizeLeft(moveX: number) {
    setActivityList(
      (it) => it.selected,
      produce((it) => {
        if (100 <= it.width - moveX) {
          it.cx += moveX / 2;
          it.width -= moveX;
        }
      })
    );
  }

  function resizeRight(moveX: number) {
    setActivityList(
      (it) => it.selected,
      produce((it) => {
        if (100 <= it.width + moveX) {
          it.cx += moveX / 2;
          it.width += moveX;
        }
      })
    );
  }

  return {
    activityList,
    setActivityList,
    addActivity,
    moveSelectedActivities,
    resizeLeft,
    resizeRight,
    layerTopActivity,
    selectActivities,
    toggleSelectActivity,
  };
}
