import { createStore, produce } from "solid-js/store";
import { ACTIVITY_MIN_WIDTH } from "../constants/app-const";
import { dataFactory } from "../data-source/data-factory";
import {
  ActivityNode,
  ActivityNodeType,
  ProcessEntity,
  TransitionEdge,
} from "../data-source/data-type";

export function makeActivityModel() {
  let _process: ProcessEntity;
  const [activityList, setActivityList] = createStore<ActivityNode[]>([]);

  function load(newProcess: ProcessEntity) {
    _process = newProcess;
    setActivityList(_process.activityNodes);
  }

  function save() {
    _process.activityNodes = [...activityList];
  }

  function addActivity(
    type: ActivityNodeType,
    actorId: number,
    cx: number,
    cy: number,
  ): ActivityNode {
    const activity = dataFactory.createActivity(_process, actorId, type);
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

  function updateJoinType(activityId: number, joinCount: number) {
    setActivityList(
      (it) => it.id === activityId,
      produce((it) => {
        switch (joinCount) {
          case 0:
            it.joinType = "notJoin";
            break;
          case 1:
            it.joinType = "oneJoin";
            break;
          default:
            if (it.joinType !== "andJoin") {
              it.joinType = "xorJoin";
            }
            break;
        }
      }),
    );
  }

  function updateSplitType(activityId: number, splitCount: number) {
    setActivityList(
      (it) => it.id === activityId,
      produce((it) => {
        switch (splitCount) {
          case 0:
            it.splitType = "notSplit";
            break;
          case 1:
            it.splitType = "oneSplit";
            break;
          default:
            if (it.splitType !== "andSplit") {
              it.splitType = "xorSplit";
            }
            break;
        }
      }),
    );
  }

  function updateAllJoinSplitType(transitions: TransitionEdge[]) {
    activityList.forEach((activity) => {
      updateJoinType(
        activity.id,
        transitions.filter((it) => it.toActivityId === activity.id).length,
      );
      updateSplitType(
        activity.id,
        transitions.filter((it) => it.fromActivityId === activity.id).length,
      );
    });
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
    updateJoinType,
    updateSplitType,
    updateAllJoinSplitType,
  };
}
