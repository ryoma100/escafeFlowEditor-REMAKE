import { createStore, produce, unwrap } from "solid-js/store";
import { ActorEntity, ProcessEntity } from "../data-source/data-type";
import { createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { dataSource } from "../data-source/data-source";

export function createActorModel() {
  let selectedProcess: ProcessEntity = dataSource.project.processes[0];
  const [actorList, setActorList] = createStore<ActorEntity[]>(
    selectedProcess.actors
  );
  const [selectedActor, setSelectedActor] = createSignal<ActorEntity>(
    actorList[0]
  );

  function saveActors() {
    dataSource.findProcess(selectedProcess.id).actors = [...unwrap(actorList)];
  }

  function loadActors(process: ProcessEntity) {
    selectedProcess = process;
    setActorList(dataSource.findProcess(process.id).actors);
    setSelectedActor(actorList[0]);
  }

  function addActor() {
    const actor = dataFactory.createActor(selectedProcess);
    setActorList([...actorList, actor]);
    const proxyActor = actorList[actorList.length - 1];
    setSelectedActor(proxyActor);
  }

  function updateActor(actor: ActorEntity) {
    setActorList(
      (it) => it.id === actor.id,
      produce((it) => {
        it.xpdlId = actor.xpdlId;
        it.name = actor.name;
      })
    );
  }

  function removeSelectedActor() {
    const nextSelectedIndex = Math.min(
      actorList.findIndex((it) => it.id === selectedActor().id),
      actorList.length - 2
    );
    const newList = actorList.filter((it) => it.id !== selectedActor().id);
    setActorList(newList);
    setSelectedActor(actorList[nextSelectedIndex]);
  }

  return {
    actorList,
    selectedActor,
    setSelectedActor,
    addActor,
    updateActor,
    removeSelectedActor,
    saveActors,
    loadActors,
  };
}
