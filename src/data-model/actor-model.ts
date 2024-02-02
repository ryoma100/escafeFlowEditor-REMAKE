import { createStore, produce } from "solid-js/store";
import { ActorEntity, ProcessEntity } from "../data-source/data-type";
import { createSignal } from "solid-js";
import { dataSource } from "../data-source/data-source";
import { dataFactory } from "../data-source/data-factory";

export function actorModel() {
  let process: ProcessEntity = dataSource.pkg.processes[0];
  const [actorList, setActorList] = createStore<ActorEntity[]>(process.actors);
  const [selectedActorId, setSelectedActorId] = createSignal<number>(
    process.actors[0].id
  );

  function changeProcess(processId: number) {
    process = dataSource.findProcess(processId);
    setActorList(process.actors);
    setSelectedActorId(process.actors[0].id);
  }

  function findActor(actorId: number): ActorEntity {
    const actor = actorList.find((it) => it.id === actorId);
    if (!actor) {
      throw new Error(`actorModel: not found actor. id=${actorId}`);
    }
    return actor;
  }

  function addActor() {
    const actor = dataFactory.createActor(process);
    setActorList([...actorList, actor]);
    setSelectedActorId(actor.id);
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
      actorList.findIndex((it) => it.id === selectedActorId()),
      actorList.length - 2
    );
    const newList = actorList.filter((it) => it.id !== selectedActorId());
    setActorList(newList);
    setSelectedActorId(newList[nextSelectedIndex].id);
  }

  return {
    changeProcess,
    actorList,
    findActor,
    selectedActorId,
    setSelectedActorId,
    addActor,
    updateActor,
    removeSelectedActor,
  };
}
