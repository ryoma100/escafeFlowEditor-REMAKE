import { produce } from "solid-js/store";
import { makeOtherEdgeModel } from "./other-edge-model";
import { makeTransitionModel } from "./transition-model";

export function makeBaseEdgeModel(
  transitionModel: ReturnType<typeof makeTransitionModel>,
  otherEdgeModel: ReturnType<typeof makeOtherEdgeModel>,
) {
  function changeSelectEdges(
    type: "select" | "selectAll" | "toggle" | "clearAll",
    ids: number[] = [],
  ) {
    transitionModel.setTransitionList(
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

    otherEdgeModel.setOtherEdgeList(
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

  function removeSelectedEdge() {
    transitionModel.setTransitionList(transitionModel.transitionList.filter((it) => !it.selected));
    otherEdgeModel.setOtherEdgeList(otherEdgeModel.otherEdgeList.filter((it) => !it.selected));
  }

  function selectedEdges() {
    return [
      ...transitionModel.transitionList.filter((it) => it.selected),
      ...otherEdgeModel.otherEdgeList.filter((it) => it.selected),
    ];
  }

  return { changeSelectEdges, removeSelectedEdge, selectedEdges };
}
