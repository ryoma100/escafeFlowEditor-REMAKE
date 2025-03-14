import { produce } from "solid-js/store";

import { ACTIVITY_MIN_WIDTH } from "@/constants/app-const";
import type { i18nEnDict } from "@/constants/i18n";
import type { NodeModel } from "@/data-model//node-model";
import { dataFactory } from "@/data-source/data-factory";
import type { ActivityNode, ActivityNodeType, ActorId, IEdge, NodeId } from "@/data-source/data-type";

export type ActivityNodeModel = ReturnType<typeof makeActivityModel>;

export function makeActivityModel(nodeModel: NodeModel) {
  function getActivityNodes(): ActivityNode[] {
    return nodeModel.nodeList.filter((it) => it.type === "activityNode") as ActivityNode[];
  }

  function addActivity(type: ActivityNodeType, actorId: ActorId, cx: number, cy: number): ActivityNode {
    const activity = dataFactory.createActivityNode(nodeModel.nodeList, actorId, type, cx, cy);
    nodeModel.setNodeList([...nodeModel.nodeList, activity]);
    return activity;
  }

  function updateActivity(activity: ActivityNode): keyof typeof i18nEnDict | undefined {
    if (activityList().some((it) => it.id !== activity.id && it.xpdlId === activity.xpdlId)) {
      return "idExists";
    }
    nodeModel.setNodeList([nodeModel.nodeList.findIndex((it) => it.id === activity.id)], activity);
  }

  function activityList(): ActivityNode[] {
    return nodeModel.nodeList.filter((it) => it.type === "activityNode") as ActivityNode[];
  }

  function getActivityNode(nodeId: NodeId): ActivityNode {
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
    nodeModel.resetGraphRect();
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
    nodeModel.resetGraphRect();
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
    nodeModel.resetGraphRect();
  }

  function updateJoinType(activityId: NodeId, joinCount: number) {
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

  function updateSplitType(activityId: NodeId, splitCount: number) {
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
    nodeModel.nodeList.forEach((node) => {
      if (node.type === "activityNode") {
        updateJoinType(node.id, edges.filter((it) => it.type === "transitionEdge" && it.toNodeId === node.id).length);
        updateSplitType(
          node.id,
          edges.filter((it) => it.type === "transitionEdge" && it.fromNodeId === node.id).length,
        );
      }
    });
  }

  return {
    addActivity,
    updateActivity,
    activityList,
    resizeActivityHeight,
    resizeLeft,
    resizeRight,
    getActivityNode,
    updateJoinType,
    updateSplitType,
    updateAllJoinSplitType,
    getActivityNodes,
    nodeModel,
  };
}
