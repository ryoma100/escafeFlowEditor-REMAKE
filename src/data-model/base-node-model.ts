import { produce } from "solid-js/store";
import { makeActivityModel } from "./activity-model";
import { makeOtherNodeModel } from "./other-node-model";

export function makeBaseNodeModel(
  activityModel: ReturnType<typeof makeActivityModel>,
  otherNodeModel: ReturnType<typeof makeOtherNodeModel>,
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

  return { changeSelectNodes, moveSelectedNodes };
}
