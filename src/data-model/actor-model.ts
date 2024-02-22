import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { enDict } from "../constants/i18n-en";
import { dataFactory } from "../data-source/data-factory";
import { ActorEntity, ProcessEntity } from "../data-source/data-type";
import { makeActivityModel } from "./activity-model";

export function makeActorModel(activityModel: ReturnType<typeof makeActivityModel>) {
  let _process: ProcessEntity;
  const [actorList, setActorList] = createStore<ActorEntity[]>([]);
  const [selectedActor, setSelectedActor] = createSignal<ActorEntity>(undefined as never);

  function load(newProcess: ProcessEntity) {
    _process = newProcess;
    setActorList(_process.actors);
    setSelectedActor(_process.actors[0]);
  }

  function save() {
    _process.actors = [...actorList];
  }

  function addActor() {
    const actor = dataFactory.createActor(_process);
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

  function removeSelectedActor(): keyof typeof enDict | null {
    if (actorList.length <= 1) return null;
    if (activityModel.activityList.some((it) => it.actorId === selectedActor().id))
      return "actorCannotDelete";

    const nextSelectedIndex = Math.min(
      actorList.findIndex((it) => it.id === selectedActor().id),
      actorList.length - 2,
    );
    const newList = actorList.filter((it) => it.id !== selectedActor().id);
    setActorList(newList);
    setSelectedActor(actorList[nextSelectedIndex]);

    return null;
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
