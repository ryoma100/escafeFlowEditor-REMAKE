import { createSignal } from "solid-js";
import { ProcessEntity } from "../data-source/data-type";
import { dataSource } from "../data-source/data-source";
import { dataFactory } from "../data-source/data-factory";

export function createProcessModel() {
  const [processList, setProcessList] = createSignal<ProcessEntity[]>(
    dataSource.pkg.processes
  );

  const [selectedProcess, setSelectedProcess] = createSignal<ProcessEntity>(
    dataSource.pkg.processes[0]
  );

  function addProcess() {
    const process = dataFactory.createProcess(dataSource.pkg);
    setProcessList([...processList(), process]);
    setSelectedProcess(process);
  }

  function updateProcess(process: ProcessEntity) {
    const newList = processList().map((it) =>
      process.id === it.id ? process : it
    );
    setProcessList(newList);
  }

  function removeSelectedProcess() {
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
    removeSelectedProcess,
  };
}
