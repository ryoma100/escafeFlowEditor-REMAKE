import { createSignal } from "solid-js";

const defaultProcessList = [...Array(20)].map((_, index) => {
  return {
    id: index + 1,
    xpdlId: `xpld-${index + 1}`,
    title: `プロセス${index + 1}`,
  };
});
let nextProcessId = defaultProcessList.length + 1;

export type ProcessEntity = {
  id: number;
  xpdlId: string;
  title: string;
};

const defaultProcess: Readonly<ProcessEntity> = {
  id: 0,
  xpdlId: "",
  title: "",
} as const;

export function processModel() {
  const [processList, setProcessList] =
    createSignal<ProcessEntity[]>(defaultProcessList);

  const [selectedProcess, setSelectedProcess] = createSignal<ProcessEntity>(
    defaultProcessList[0]
  );

  function addProcess() {
    const item = {
      id: nextProcessId,
      xpdlId: `xpdlId-${nextProcessId}`,
      title: `プロセス${nextProcessId}`,
    };
    nextProcessId++;
    setProcessList([...processList(), item]);
    setSelectedProcess(item);
  }

  function updateProcess(process: ProcessEntity) {
    const newList = processList().map((it) =>
      process.id === it.id ? process : it
    );
    setProcessList(newList);
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
    updateProcess,
    removeProcess,
    defaultProcess,
  };
}
