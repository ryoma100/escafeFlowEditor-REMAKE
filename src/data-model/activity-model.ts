import { createStore, produce, unwrap } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { ACTIVITY_MIN_WIDTH, dataSource } from "../data-source/data-source";
import { ActivityNodeEntity, ProcessEntity } from "../data-source/data-type";
import { createActorModel } from "./actor-model";

export function createActivityModel(actorModel: ReturnType<typeof createActorModel>) {
  let selectedProcess: ProcessEntity = dataSource.project.processes[0];
  const [activityList, setActivityList] = createStore<ActivityNodeEntity[]>([]);

  function saveActivity() {
    dataSource.findProcess(selectedProcess.id).activities = [...unwrap(activityList)];
  }

  function loadActivity(process: ProcessEntity) {
    selectedProcess = process;
    setActivityList(dataSource.findProcess(process.id).activities);
  }

  function addActivity(
    activityType: ActivityNodeEntity["activityType"],
    cx: number,
    cy: number,
  ): ActivityNodeEntity {
    const activity = dataFactory.createActivity(
      selectedProcess,
      actorModel.selectedActor().id,
      activityType,
    );
    activity.x = cx - activity.width / 2;
    activity.y = cy - activity.height / 2;
    setActivityList([...activityList, activity]);
    return activity;
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
    activityList,
    setActivityList,
    addActivity,
    moveSelectedActivities,
    resizeLeft,
    resizeRight,
    layerTopActivity,
    selectActivities,
    toggleSelectActivity,
    saveActivity,
    loadActivity,
  };
}
