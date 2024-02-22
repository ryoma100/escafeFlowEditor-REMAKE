import { produce } from "solid-js/store";
import { INode } from "../data-source/data-type";
import { makeActivityModel } from "./activity-model";
import { makeOtherEdgeModel } from "./other-edge-model";
import { makeOtherNodeModel } from "./other-node-model";
import { makeTransitionModel } from "./transition-model";

export function makeBaseNodeModel(
  activityModel: ReturnType<typeof makeActivityModel>,
  otherNodeModel: ReturnType<typeof makeOtherNodeModel>,
  transitionModel: ReturnType<typeof makeTransitionModel>,
  otherEdgeModel: ReturnType<typeof makeOtherEdgeModel>,
) {
  function changeSelectNodes(
    type: "select" | "selectAll" | "toggle" | "clearAll",
    ids: number[] = [],
  ) {
    activityModel.setActivityList(
      (it) => type !== "toggle" || (type === "toggle" && ids.includes(it.id)),
      produce((it) => {
        switch (type) {
          case "select":
            it.selected = ids.includes(it.id);
            break;
          case "selectAll":
            it.selected = true;
            break;
          case "toggle":
            it.selected = !it.selected;
            break;
          case "clearAll":
            it.selected = false;
            break;
        }
      }),
    );

    otherNodeModel.setOtherNodeList(
      (it) => type !== "toggle" || (type === "toggle" && ids.includes(it.id)),
      produce((it) => {
        switch (type) {
          case "select":
            it.selected = ids.includes(it.id);
            break;
          case "selectAll":
            it.selected = true;
            break;
          case "toggle":
            it.selected = !it.selected;
            break;
          case "clearAll":
            it.selected = false;
            break;
        }
      }),
    );
  }

  function moveSelectedNodes(moveX: number, moveY: number) {
    activityModel.setActivityList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      }),
    );

    otherNodeModel.setOtherNodeList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      }),
    );
  }

  function removeSelectedNodes() {
    transitionModel.setTransitionList(
      transitionModel.transitionList.filter(
        (it) =>
          !activityModel.getActivityNode(it.fromActivityId).selected &&
          !activityModel.getActivityNode(it.toActivityId).selected,
      ),
    );
    otherEdgeModel.setOtherEdgeList(
      otherEdgeModel.otherEdgeList.filter((it) => {
        switch (it.type) {
          case "commentEdge":
            return (
              !otherNodeModel.getCommentNode(it.fromCommentId).selected &&
              !activityModel.getActivityNode(it.toActivityId).selected
            );
          case "startEdge":
            return (
              !otherNodeModel.getStartNode(it.fromStartId).selected &&
              !activityModel.getActivityNode(it.toActivityId).selected
            );
          case "endEdge":
            return (
              !activityModel.getActivityNode(it.fromActivityId).selected &&
              !otherNodeModel.getEndNode(it.toEndId).selected
            );
        }
      }),
    );

    activityModel.setActivityList(activityModel.activityList.filter((it) => !it.selected));
    otherNodeModel.setOtherNodeList(otherNodeModel.otherNodeList.filter((it) => !it.selected));
  }

  function selectedNodes() {
    return [
      ...activityModel.activityList.filter((it) => it.selected),
      ...otherNodeModel.otherNodeList.filter((it) => it.selected),
    ];
  }

  function maxRectangle() {
    const nodes: INode[] = [...activityModel.activityList, ...otherNodeModel.otherNodeList];
    if (nodes.length === 0) return null;

    const area = nodes.reduce(
      (rect, node) => {
        return {
          left: Math.min(rect.left, node.x),
          top: Math.min(rect.top, node.y),
          right: Math.max(rect.right, node.x + node.width),
          bottom: Math.max(rect.bottom, node.y + node.height),
        };
      },
      {
        left: Number.MAX_SAFE_INTEGER,
        top: Number.MAX_SAFE_INTEGER,
        right: Number.MIN_SAFE_INTEGER,
        bottom: Number.MIN_SAFE_INTEGER,
      },
    );

    return {
      x: area.left,
      y: area.top,
      width: area.right - area.left,
      height: area.bottom - area.top,
    };
  }

  return { changeSelectNodes, moveSelectedNodes, removeSelectedNodes, selectedNodes, maxRectangle };
}
