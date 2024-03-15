import { produce } from "solid-js/store";
import { ACTIVITY_MIN_WIDTH } from "../constants/app-const";
import { dataFactory } from "../data-source/data-factory";
import { ActivityNode, ActivityNodeType, IEdge } from "../data-source/data-type";
import { makeNodeModel } from "./node-model";

export function makeActivityModel(nodeModel: ReturnType<typeof makeNodeModel>) {
  function getActivityNodes(): ActivityNode[] {
    return nodeModel.nodeList.filter((it) => it.type === "activityNode") as ActivityNode[];
  }

  function addActivity(
    type: ActivityNodeType,
    actorId: number,
    cx: number,
    cy: number,
  ): ActivityNode {
    const activity = dataFactory.createActivityNode(nodeModel.nodeList, actorId, type);
    activity.x = cx - activity.width / 2;
    activity.y = cy - activity.height / 2;
    nodeModel.setNodeList([...nodeModel.nodeList, activity]);
    return activity;
  }
  1;
  function getActivityNode(nodeId: number): ActivityNode {
    const node = nodeModel.getNode(nodeId);
    if (node.type !== "activityNode") {
      throw new Error(`getActivityNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function resizeActivityHeight(activity: ActivityNode, height: number) {
    nodeModel.setNodeList(
      (it) => it.id === activity.id,
      produce((it) => {
        it.y -= (height - it.height) / 2;
        it.height = height;
      }),
    );
  }

  function resizeLeft(moveX: number) {
    nodeModel.setNodeList(
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
    nodeModel.setNodeList(
      (it) => it.selected,
      produce((it) => {
        if (ACTIVITY_MIN_WIDTH <= it.width + moveX) {
          it.width += moveX;
        }
      }),
    );
  }

  function updateJoinType(activityId: number, joinCount: number) {
    nodeModel.setNodeList(
      (it) => it.id === activityId,
      produce((it) => {
        if (it.type === "activityNode") {
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
        }
      }),
    );
  }

  function updateSplitType(activityId: number, splitCount: number) {
    nodeModel.setNodeList(
      (it) => it.id === activityId,
      produce((it) => {
        if (it.type === "activityNode") {
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
        }
      }),
    );
  }

  function updateAllJoinSplitType(edges: IEdge[]) {
    nodeModel.nodeList.forEach((it) => {
      if (it.type === "activityNode") {
        updateJoinType(
          it.id,
          edges.filter((it) => it.type === "transitionEdge" && it.toNodeId === it.id).length,
        );
        updateSplitType(
          it.id,
          edges.filter((it) => it.type === "transitionEdge" && it.fromNodeId === it.id).length,
        );
      }
    });
  }

  return {
    addActivity,
    resizeActivityHeight,
    resizeLeft,
    resizeRight,
    getActivityNode,
    updateJoinType,
    updateSplitType,
    updateAllJoinSplitType,
    getActivityNodes,
  };
}
