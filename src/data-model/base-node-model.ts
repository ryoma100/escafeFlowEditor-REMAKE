import { produce } from "solid-js/store";
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

  return { changeSelectNodes, moveSelectedNodes, removeSelectedNodes, selectedNodes };
}
