import { batch, createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { IProcessDetailEntity, ProcessEntity, ProjectEntity } from "../data-source/data-type";
import { makeActivityModel } from "./activity-model";
import { makeActorModel } from "./actor-model";
import { makeOtherEdgeModel } from "./other-edge-model";
import { makeOtherNodeModel } from "./other-node-model";
import { makeTransitionModel } from "./transition-model";

export function makeProcessModel(
  actorModel: ReturnType<typeof makeActorModel>,
  activityModel: ReturnType<typeof makeActivityModel>,
  transitionModel: ReturnType<typeof makeTransitionModel>,
  otherNodeModel: ReturnType<typeof makeOtherNodeModel>,
  otherEdgeModel: ReturnType<typeof makeOtherEdgeModel>,
) {
  let project: ProjectEntity;
  const [processList, setProcessList] = createSignal<ProcessEntity[]>([]);
  const [selectedProcess, setSelectedProcess] = createSignal<ProcessEntity>(undefined as never);

  function load(newProject: ProjectEntity) {
    project = newProject;
    setProcessList(project.processes);
    batch(() => {
      const firstProcess = project.processes[0];
      setSelectedProcess(firstProcess);
      actorModel.load(firstProcess);
      activityModel.load(firstProcess);
      transitionModel.load(firstProcess);
      otherNodeModel.load(firstProcess);
      otherEdgeModel.load(firstProcess);
    });
  }

  function save() {
    actorModel.save();
    activityModel.save();
    transitionModel.save();
    otherNodeModel.save();
    otherEdgeModel.save();
  }

  function changeProcess(process: ProcessEntity) {
    save();
    batch(() => {
      setSelectedProcess(process);
      actorModel.load(process);
      activityModel.load(process);
      transitionModel.load(process);
      otherNodeModel.load(process);
      otherEdgeModel.load(process);
    });
  }

  function addProcess() {
    const newProcess = dataFactory.createProcess(project);
    setProcessList([...processList(), newProcess]);
    project.processes = [...processList()];
    changeProcess(newProcess);
  }

  function updateProcessDetail(process: IProcessDetailEntity) {
    const newList = processList().map((it) => (process.id === it.id ? { ...it, ...process } : it));
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
    project.processes = [...processList()];
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
