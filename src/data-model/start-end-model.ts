import { createStore, produce } from "solid-js/store";
import { NORMAL_ICON_SIZE } from "../constants/app-const";
import { dataFactory } from "../data-source/data-factory";
import { ProcessEntity, StartEndNodeEntity } from "../data-source/data-type";

export function makeStartEndModel() {
  let process: ProcessEntity;
  const [startEndList, setStartEndList] = createStore<StartEndNodeEntity[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setStartEndList(process.startEndNodes);
  }

  function save() {
    process.startEndNodes = [...startEndList];
  }

  function addStartEnd(type: "startNode" | "endNode", cx: number, cy: number): StartEndNodeEntity {
    const node = dataFactory.createStartEnd(process, type);
    node.x = cx - NORMAL_ICON_SIZE / 2;
    node.y = cy - NORMAL_ICON_SIZE / 2;
    setStartEndList([...startEndList, node]);
    return node;
  }

  function moveSelectedStartEnds(moveX: number, moveY: number) {
    setStartEndList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      }),
    );
  }

  function selectStartEnds(ids: number[]) {
    setStartEndList(
      () => true,
      produce((it) => {
        const selected = ids.includes(it.id);
        if (it.selected !== selected) {
          it.selected = selected;
        }
      }),
    );
  }

  function toggleSelectStartEnd(id: number) {
    setStartEndList(
      (it) => it.id === id,
      produce((it) => {
        it.selected = !it.selected;
      }),
    );
  }

  return {
    load,
    save,
    addStartEnd,
    selectStartEnds,
    toggleSelectStartEnd,
    moveSelectedStartEnds,
    startEndList,
  };
}
