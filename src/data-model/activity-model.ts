import { createStore, produce } from "solid-js/store";
import { ACTIVITY_MIN_WIDTH } from "../constants/app-const";
import { dataFactory } from "../data-source/data-factory";
import { ActivityNode, ActivityNodeType, ProcessEntity } from "../data-source/data-type";
import { makeActorModel } from "./actor-model";

export function makeActivityModel(actorModel: ReturnType<typeof makeActorModel>) {
  let process: ProcessEntity;
  const [activityList, setActivityList] = createStore<ActivityNode[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setActivityList(process.activityNodes);
  }

  function save() {
    process.activityNodes = [...activityList];
  }

  function addActivity(type: ActivityNodeType, cx: number, cy: number): ActivityNode {
    const activity = dataFactory.createActivity(process, actorModel.selectedActor().id, type);
    activity.x = cx - activity.width / 2;
    activity.y = cy - activity.height / 2;
    setActivityList([...activityList, activity]);
    return activity;
  }

  function getActivityNode(nodeId: number): ActivityNode {
    const node = activityList.find((it) => it.id === nodeId);
    if (node == null) {
      throw new Error(`getActivityNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function resizeActivityHeight(activity: ActivityNode, height: number) {
    setActivityList(
      (it) => it.id === activity.id,
      produce((it) => {
        it.y -= (height - it.height) / 2;
        it.height = height;
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
    resizeLeft,
    resizeRight,
    layerTopActivity,
    getActivityNode,
  };
}
