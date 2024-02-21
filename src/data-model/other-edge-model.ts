import { createStore, produce } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { CommentEdge, EndEdge, ProcessEntity, StartEdge } from "../data-source/data-type";
import { makeActivityModel } from "./activity-model";
import { makeOtherNodeModel } from "./other-node-model";

export function makeOtherEdgeModel(
  otherNodeModel: ReturnType<typeof makeOtherNodeModel>,
  activityModel: ReturnType<typeof makeActivityModel>,
) {
  let process: ProcessEntity;
  const [otherEdgeList, setOtherEdgeList] = createStore<(CommentEdge | StartEdge | EndEdge)[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setOtherEdgeList(process.otherEdges);
  }

  function save() {
    process.otherEdges = [...otherEdgeList];
  }

  function addCommentEdge(toActivityId: number): CommentEdge {
    const fromCommentId = otherNodeModel.otherNodeList.find((it) => it.selected)!.id;
    const edge = dataFactory.createCommentEdge(process, fromCommentId, toActivityId);
    setOtherEdgeList([...otherEdgeList, edge]);
    return edge;
  }

  function addStartEdge(toActivityId: number): StartEdge {
    const fromStartId = otherNodeModel.otherNodeList.find((it) => it.selected)!.id;
    const edge = dataFactory.createStartEdge(process, fromStartId, toActivityId);
    setOtherEdgeList([...otherEdgeList, edge]);
    return edge;
  }

  function addEndEdge(toEndNodeId: number): EndEdge {
    const fromActivityId = activityModel.activityList.find((it) => it.selected)!.id;
    const edge = dataFactory.createEndEdge(process, fromActivityId, toEndNodeId);
    setOtherEdgeList([...otherEdgeList, edge]);
    return edge;
  }

  function selectOtherEdges(ids: number[]) {
    setOtherEdgeList(
      () => true,
      produce((it) => {
        const selected = ids.includes(it.id);
        if (it.selected !== selected) {
          it.selected = selected;
        }
      }),
    );
  }

  function toggleSelectOtherEdge(id: number) {
    setOtherEdgeList(
      (it) => it.id === id,
      produce((it) => {
        it.selected = !it.selected;
      }),
    );
  }

  return {
    load,
    save,
    otherEdgeList,
    addCommentEdge,
    addStartEdge,
    addEndEdge,
    selectOtherEdges,
    toggleSelectOtherEdge,
  };
}
