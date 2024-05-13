import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { i18nEnDict } from "@/constants/i18n";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { ActorEntity, INode, ProcessEntity } from "@/data-source/data-type";

const dummy = dataFactory.createActorEntity([]);

export function makeActorModel() {
  const [actorList, setActorList] = createStore<ActorEntity[]>([]);
  const [selectedActor, setSelectedActor] = createSignal<ActorEntity>(dummy);

  function load(newProcess: ProcessEntity) {
    setActorList(newProcess.actors);
    setSelectedActor(newProcess.actors[0]);
  }

  function save(): ActorEntity[] {
    return deepUnwrap(actorList);
  }

  function addActor() {
    const actor = dataFactory.createActorEntity(actorList);
    setActorList([...actorList, actor]);
    setSelectedActor(actor);
  }

  function updateActor(actor: ActorEntity): keyof typeof i18nEnDict | undefined {
    if (actorList.some((it) => it.id !== actor.id && it.xpdlId === actor.xpdlId)) {
      return "idExists";
    }
    setActorList([actorList.findIndex((it) => it.id === actor.id)], actor);
  }

  function removeSelectedActor(nodeList: INode[]): keyof typeof i18nEnDict | null {
    if (actorList.length <= 1) return null;
    if (nodeList.some((it) => it.type === "activityNode" && it.actorId === selectedActor().id))
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
