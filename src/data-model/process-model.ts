import { batch, createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { ProcessEntity, ProjectEntity } from "../data-source/data-type";
import { makeActorModel } from "./actor-model";
import { makeBaseEdgeModel } from "./base-edge-model";
import { makeBaseNodeModel } from "./base-node-model";

export function makeProcessModel(
  actorModel: ReturnType<typeof makeActorModel>,
  baseNodeModel: ReturnType<typeof makeBaseNodeModel>,
  baseEdgeModel: ReturnType<typeof makeBaseEdgeModel>,
) {
  let _project: ProjectEntity;
  const [processList, setProcessList] = createSignal<ProcessEntity[]>([]);
  const [selectedProcess, setSelectedProcess] = createSignal<ProcessEntity>(undefined as never);

  function load(newProject: ProjectEntity) {
    _project = newProject;
    setProcessList(_project.processes);
    batch(() => {
      const firstProcess = processList()[0];
      setSelectedProcess(firstProcess);
      actorModel.load(firstProcess);
      baseNodeModel.load(firstProcess);
      baseEdgeModel.load(firstProcess);
    });
  }

  function sync() {
    const process: ProcessEntity = {
      ...selectedProcess(),
      actors: actorModel.save(),
      nodes: baseNodeModel.save(),
      edges: baseEdgeModel.save(),
    };
    setProcessList(processList().map((it) => (it.id === process.id ? process : it)));
    setSelectedProcess(processList().find((it) => it.id === process.id)!);
  }

  function changeProcess(newProcess: ProcessEntity) {
    sync();

    const process = processList().find((it) => it.id === newProcess.id)!;

    batch(() => {
      setSelectedProcess(process);
      actorModel.load(process);
      baseNodeModel.load(process);
      baseEdgeModel.load(process);
    });
  }

  function addProcess() {
    const newProcess = dataFactory.createProcess(_project);
    setProcessList([...processList(), newProcess]);
    changeProcess(newProcess);
  }

  function updateProcessDetail(process: ProcessEntity) {
    const newList = processList().map((it) => (process.id === it.id ? process : it));
    setProcessList(newList);
    setSelectedProcess(newList.find((it) => it.id === process.id)!);
  }

  function removeSelectedProcess() {
    if (processList().length <= 1) return;

    const nextSelectedIndex = Math.min(
      processList().findIndex((it) => it.id === selectedProcess().id),
      processList().length - 2,
    );
    const newList = processList().filter((it) => it.id !== selectedProcess().id);
    setProcessList(newList);
    setSelectedProcess(processList()[nextSelectedIndex]);
    _project.processes = [...processList()];
    changeProcess(selectedProcess());
  }

  return {
    load,
    save: sync,
    processList,
    selectedProcess,
    changeProcess,
    addProcess,
    updateProcessDetail,
    removeSelectedProcess,
  };
}
