import { batch, createSignal } from "solid-js";
import { deepCopy } from "../data-source/data-converter";
import { dataFactory } from "../data-source/data-factory";
import { ProcessEntity, ProjectEntity } from "../data-source/data-type";
import { makeActorModel } from "./actor-model";
import { makeEdgeModel } from "./edge-model";
import { makeNodeModel } from "./node-model";

export function makeProcessModel(
  actorModel: ReturnType<typeof makeActorModel>,
  nodeModel: ReturnType<typeof makeNodeModel>,
  edgeModel: ReturnType<typeof makeEdgeModel>,
) {
  const [processList, setProcessList] = createSignal<ProcessEntity[]>([]);
  const [selectedProcess, setSelectedProcess] = createSignal<ProcessEntity>(undefined as never);

  function load(project: ProjectEntity) {
    setProcessList(project.processes);
    batch(() => {
      const firstProcess = processList()[0];
      setSelectedProcess(firstProcess);
      actorModel.load(firstProcess);
      nodeModel.load(firstProcess);
      edgeModel.load(firstProcess);
    });
  }

  function save(): ProcessEntity[] {
    const process: ProcessEntity = {
      ...selectedProcess(),
      actors: actorModel.save(),
      nodes: nodeModel.save(),
      edges: edgeModel.save(),
    };
    setProcessList(processList().map((it) => (it.id === process.id ? process : it)));
    setSelectedProcess(processList().find((it) => it.id === process.id)!);

    return deepCopy(processList());
  }

  function changeProcess(newProcess: ProcessEntity) {
    save();

    const process = processList().find((it) => it.id === newProcess.id)!;

    batch(() => {
      setSelectedProcess(process);
      actorModel.load(process);
      nodeModel.load(process);
      edgeModel.load(process);
    });
  }

  function addProcess(processes: ProcessEntity[]) {
    const newProcess = dataFactory.createProcess(processes);
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
    changeProcess(selectedProcess());
  }

  return {
    load,
    save,
    processList,
    selectedProcess,
    changeProcess,
    addProcess,
    updateProcessDetail,
    removeSelectedProcess,
  };
}
