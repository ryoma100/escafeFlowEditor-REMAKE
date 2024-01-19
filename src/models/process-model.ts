import { createSignal } from "solid-js";

const defaultProcessList = [...Array(20)].map((_, index) => {
  return { id: index + 1, title: `プロセス${index + 1}` };
});

export type ProcessType = {
  id: number;
  title: string;
};

export function processModel() {
  const [processList, setProcessList] =
    createSignal<ProcessType[]>(defaultProcessList);

  const [selectedProcess, setSelectedProcess] = createSignal<ProcessType>(
    defaultProcessList[0]
  );

  function addProcess() {
    const item = { id: 99, title: "テスト" };
    setProcessList([...processList(), item]);
    setSelectedProcess(item);
  }

  function removeProcess() {
    const nextSelectedIndex = Math.min(
      processList().findIndex((it) => it.id === selectedProcess().id),
      processList().length - 2
    );
    const newList = processList().filter(
      (it) => it.id !== selectedProcess().id
    );
    setProcessList(newList);
    setSelectedProcess(newList[nextSelectedIndex]);
  }

  return {
    processList,
    selectedProcess,
    setSelectedProcess,
    addProcess,
    removeProcess,
  };
}
