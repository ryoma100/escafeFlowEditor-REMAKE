import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { enDict } from "../constants/i18n-en";
import { dataFactory, deepCopy } from "../data-source/data-factory";
import { ActorEntity, INode, ProcessEntity } from "../data-source/data-type";

const dummy = dataFactory.createActorEntity([]);

export function makeActorModel() {
  const [actorList, setActorList] = createStore<ActorEntity[]>([]);
  const [selectedActor, setSelectedActor] = createSignal<ActorEntity>(dummy);

  function load(newProcess: ProcessEntity) {
    setActorList(newProcess.actors);
    setSelectedActor(newProcess.actors[0]);
  }

  function save(): ActorEntity[] {
    return deepCopy(actorList);
  }

  function addActor(process: ProcessEntity) {
    const actor = dataFactory.createActorEntity(process.actors);
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

  function removeSelectedActor(nodeList: INode[]): keyof typeof enDict | null {
    if (actorList.length <= 1) return null;
    if (nodeList.some((it) => it.id === selectedActor().id)) return "actorCannotDelete";

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
