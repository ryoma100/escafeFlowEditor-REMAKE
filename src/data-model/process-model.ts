import { batch, createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { ProcessEntity, ProjectEntity } from "../data-source/data-type";
import { makeActivityModel } from "./activity-model";
import { makeActorModel } from "./actor-model";
import { makeCommentModel } from "./comment-model";
import { makeTransitionModel } from "./transition-model";

export function makeProcessModel(
  actorModel: ReturnType<typeof makeActorModel>,
  activityModel: ReturnType<typeof makeActivityModel>,
  transitionModel: ReturnType<typeof makeTransitionModel>,
  commentModel: ReturnType<typeof makeCommentModel>,
) {
  let project: ProjectEntity;
  const [processList, setProcessList] = createSignal<ProcessEntity[]>([]);
  const [selectedProcess, setSelectedProcess] = createSignal<ProcessEntity>(undefined as never);

  function load(newProject: ProjectEntity) {
    project = newProject;
    const process = project.processes[0];
    batch(() => {
      setProcessList(project.processes);
      setSelectedProcess(process);
      actorModel.load(process);
      activityModel.load(process);
      transitionModel.load(process);
      commentModel.load(process);
    });
  }

  function save() {
    project.processes = [...processList()];
    actorModel.save();
    activityModel.save();
    transitionModel.save();
    commentModel.save();
  }

  function changeProcess(process: ProcessEntity) {
    actorModel.save();
    activityModel.save();
    transitionModel.save();
    commentModel.save();
    batch(() => {
      setSelectedProcess(process);
      actorModel.load(process);
      activityModel.load(process);
      transitionModel.load(process);
      commentModel.load(process);
    });
  }

  function addProcess() {
    const newProcess = dataFactory.createProcess(project);
    setProcessList([...processList(), newProcess]);
    changeProcess(newProcess);
  }

  function updateProcess(process: ProcessEntity) {
    const newList = processList().map((it) => (process.id === it.id ? process : it));
    setProcessList(newList);
  }

  function removeSelectedProcess() {
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
    updateProcess,
    removeSelectedProcess,
  };
}
