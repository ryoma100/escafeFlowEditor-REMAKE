import { createStore, produce, unwrap } from "solid-js/store";
import { ActorEntity, ProcessEntity } from "../data-source/data-type";
import { createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { dataSource } from "../data-source/data-source";

export function createActorModel() {
  console.log("createActorModel");

  let selectedProcess: ProcessEntity = dataSource.pkg.processes[0];
  const [actorList, setActorList] = createStore<ActorEntity[]>(
    selectedProcess.actors
  );
  const [selectedActor, setSelectedActor] = createSignal<ActorEntity>(
    actorList[0]
  );

  function changeProcess(process: ProcessEntity) {
    dataSource.findProcess(selectedProcess.id).actors = [...actorList];

    selectedProcess = process;
    setActorList(dataSource.findProcess(selectedProcess.id).actors);
    setSelectedActor(actorList[0]);
  }

  function findActor(actorId: number): ActorEntity {
    const actor = actorList.find((it) => it.id === actorId);
    if (!actor) {
      throw new Error(`actorModel: not found actor. id=${actorId}`);
    }
    return actor;
  }

  function addActor() {
    const actor = dataFactory.createActor(selectedProcess);
    setActorList([...actorList, actor]);
    const proxyActor = actorList[actorList.length - 1];
    setSelectedActor(proxyActor);
    console.log("add", unwrap(actorList));
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
    changeProcess: changeProcess,
  };
}
