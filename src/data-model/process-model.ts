import { batch, createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { dataSource } from "../data-source/data-source";
import { ProcessEntity } from "../data-source/data-type";
import { createActivityModel } from "./activity-model";
import { createActorModel } from "./actor-model";
import { createCommentModel } from "./comment-model";
import { createTransitionModel } from "./transition-model";

export function createProcessModel(
  actorModel: ReturnType<typeof createActorModel>,
  activityModel: ReturnType<typeof createActivityModel>,
  transitionModel: ReturnType<typeof createTransitionModel>,
  commentModel: ReturnType<typeof createCommentModel>,
) {
  const [processList, setProcessList] = createSignal<ProcessEntity[]>(
    // ネストしたフィールドをリアクティブにしないため、createStore()は使わない
    dataSource.project.processes,
  );
  const [selectedProcess, setSelectedProcess] = createSignal<ProcessEntity>(
    dataSource.project.processes[0],
  );

  function changeProcess(process: ProcessEntity) {
    actorModel.saveActors();
    activityModel.saveActivity();
    transitionModel.saveTransition();
    commentModel.saveComment();
    batch(() => {
      setSelectedProcess(process);
      actorModel.loadActors(process);
      activityModel.loadActivity(process);
      transitionModel.loadTransition(process);
      commentModel.loadComment(process);
    });
  }

  function addProcess() {
    const process = dataFactory.createProcess(dataSource.project);
    dataSource.project.processes = [...dataSource.project.processes, process];
    setProcessList(dataSource.project.processes);
    changeProcess(process);
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
    processList,
    selectedProcess,
    changeProcess,
    addProcess,
    updateProcess,
    removeSelectedProcess,
  };
}
