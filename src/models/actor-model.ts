import { createStore, produce } from "solid-js/store";
import { ActorEntity } from "../data-source/data-type";
import { createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { createProcessModel } from "./process-model";

export function createActorModel(
  processModel: ReturnType<typeof createProcessModel>
) {
  const [actorList, setActorList] = createStore<ActorEntity[]>(
    processModel.selectedProcess().actors
  );
  const [selectedActor, setSelectedActor] = createSignal<ActorEntity>(
    actorList[0]
  );

  // function changeProcess(processId: number) {
  //   process = dataSource.findProcess(processId);
  //   setActorList(process.actors);
  //   setSelectedActorId(process.actors[0].id);
  // }

  function findActor(actorId: number): ActorEntity {
    const actor = actorList.find((it) => it.id === actorId);
    if (!actor) {
      throw new Error(`actorModel: not found actor. id=${actorId}`);
    }
    return actor;
  }

  function addActor() {
    const actor = dataFactory.createActor(processModel.selectedProcess());
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
      actorList.findIndex((it) => it === selectedActor()),
      actorList.length - 2
    );
    const newList = actorList.filter((it) => it !== selectedActor());
    setActorList(newList);
    setSelectedActor(newList[nextSelectedIndex]);
  }

  return {
    actorList,
    findActor,
    selectedActor,
    setSelectedActor,
    addActor,
    updateActor,
    removeSelectedActor,
  };
}
