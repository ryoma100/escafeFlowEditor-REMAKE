import { createStore, produce, unwrap } from "solid-js/store";
import { ActivityEntity, ProcessEntity } from "../data-source/data-type";
import { dataFactory } from "../data-source/data-factory";
import { dataSource } from "../data-source/data-source";
import { createActorModel } from "./actor-model";

export function createActivityModel(
  actorModel: ReturnType<typeof createActorModel>
) {
  let selectedProcess: ProcessEntity = dataSource.pkg.processes[0];
  const [activityList, setActivityList] = createStore<ActivityEntity[]>([]);

  function saveActivity() {
    dataSource.findProcess(selectedProcess.id).activities = [
      ...unwrap(activityList),
    ];
  }

  function loadActivity(process: ProcessEntity) {
    selectedProcess = process;
    setActivityList(dataSource.findProcess(process.id).activities);
  }

  function addActivity(
    type: ActivityEntity["type"],
    cx: number,
    cy: number
  ): ActivityEntity {
    const activity = dataFactory.createActivity(
      selectedProcess,
      actorModel.selectedActor().id,
      type
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
          it.x += moveX;
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
    saveActivity,
    loadActivity,
  };
}
