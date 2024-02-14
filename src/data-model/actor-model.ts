import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { ActorEntity, ProcessEntity } from "../data-source/data-type";

export function makeActorModel() {
  let process: ProcessEntity;
  const [actorList, setActorList] = createStore<ActorEntity[]>([]);
  const [selectedActor, setSelectedActor] = createSignal<ActorEntity>(undefined as never);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setActorList(process.actors);
    setSelectedActor(process.actors[0]);
  }

  function save() {
    process.actors = [...actorList];
  }

  function addActor() {
    const actor = dataFactory.createActor(process);
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
      }),
    );
  }

  function removeSelectedActor() {
    const nextSelectedIndex = Math.min(
      actorList.findIndex((it) => it.id === selectedActor().id),
      actorList.length - 2,
    );
    const newList = actorList.filter((it) => it.id !== selectedActor().id);
    setActorList(newList);
    setSelectedActor(actorList[nextSelectedIndex]);
  }

  return {
    load,
    save,
    actorList,
    selectedActor,
    setSelectedActor,
    addActor,
    updateActor,
    removeSelectedActor,
  };
}
