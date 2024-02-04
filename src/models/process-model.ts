import { createSignal } from "solid-js";
import { ProcessEntity } from "../data-source/data-type";
import { dataSource } from "../data-source/data-source";
import { dataFactory } from "../data-source/data-factory";
import { createActorModel } from "./actor-model";

export function createProcessModel(
  actorModel: ReturnType<typeof createActorModel>
) {
  const [processList, setProcessList] = createSignal<ProcessEntity[]>(
    dataSource.pkg.processes
  );
  const [selectedProcess, setSelectedProcess] = createSignal<ProcessEntity>(
    dataSource.pkg.processes[0]
  );

  function changeProcess(process: ProcessEntity) {
    actorModel.changeProcess(process);
    setSelectedProcess(process);
  }

  function addProcess() {
    const process = dataFactory.createProcess(dataSource.pkg);
    dataSource.pkg.processes = [...dataSource.pkg.processes, process];
    setProcessList(dataSource.pkg.processes);
    changeProcess(process);
  }

  function updateProcess(process: ProcessEntity) {
    const newList = processList().map((it) =>
      process.id === it.id ? process : it
    );
    setProcessList(newList);
  }

  function removeSelectedProcess() {
    dataSource.pkg.processes = dataSource.pkg.processes.filter(
      (it) => it.id !== selectedProcess().id
    );
    setProcessList(dataSource.pkg.processes);
    changeProcess(dataSource.pkg.processes[0]);
  }

  return {
    processList,
    selectedProcess,
    changeProcess,
    addProcess,
    updateProcess,
    removeSelectedProcess,
  };
}
