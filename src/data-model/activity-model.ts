import { createStore, produce } from "solid-js/store";
import { ACTIVITY_MIN_WIDTH } from "../constants/app-const";
import { dataFactory } from "../data-source/data-factory";
import { ActivityNodeEntity, ProcessEntity } from "../data-source/data-type";
import { makeActorModel } from "./actor-model";

export function makeActivityModel(actorModel: ReturnType<typeof makeActorModel>) {
  let process: ProcessEntity;
  const [activityList, setActivityList] = createStore<ActivityNodeEntity[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setActivityList(process.activities);
  }

  function save() {
    process.activities = [...activityList];
  }

  function addActivity(
    activityType: ActivityNodeEntity["activityType"],
    cx: number,
    cy: number,
  ): ActivityNodeEntity {
    const activity = dataFactory.createActivity(
      process,
      actorModel.selectedActor().id,
      activityType,
    );
    activity.x = cx - activity.width / 2;
    activity.y = cy - activity.height / 2;
    setActivityList([...activityList, activity]);
    return activity;
  }

  function resizeActivityHeight(activity: ActivityNodeEntity, height: number) {
    setActivityList(
      (it) => it.id === activity.id,
      produce((it) => {
        it.y -= (height - it.height) / 2;
        it.height = height;
      }),
    );
  }

  function moveSelectedActivities(moveX: number, moveY: number) {
    setActivityList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      }),
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
      }),
    );
  }

  function toggleSelectActivity(id: number) {
    setActivityList(
      (it) => it.id === id,
      produce((it) => {
        it.selected = !it.selected;
      }),
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
        if (ACTIVITY_MIN_WIDTH <= it.width - moveX) {
          it.x += moveX;
          it.width -= moveX;
        }
      }),
    );
  }

  function resizeRight(moveX: number) {
    setActivityList(
      (it) => it.selected,
      produce((it) => {
        if (ACTIVITY_MIN_WIDTH <= it.width + moveX) {
          it.width += moveX;
        }
      }),
    );
  }

  return {
    load,
    save,
    activityList,
    setActivityList,
    addActivity,
    resizeActivityHeight,
    moveSelectedActivities,
    resizeLeft,
    resizeRight,
    layerTopActivity,
    selectActivities,
    toggleSelectActivity,
  };
}
