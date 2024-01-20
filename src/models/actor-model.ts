import { createSignal } from "solid-js";

const defaultActorList = [...Array(10)].map((_, index) => {
  return {
    id: index + 1,
    xpdlId: `newpkg_wp1_par${index + 1}`,
    title: `アクター${index + 1}`,
  };
});
let nextActorId = defaultActorList.length + 1;

export type ActorEntity = {
  id: number;
  xpdlId: string;
  title: string;
};

function defaultActor(): ActorEntity {
  return {
    id: 0,
    xpdlId: "",
    title: "",
  };
}

export function actorModel() {
  const [actorList, setActorList] =
    createSignal<ActorEntity[]>(defaultActorList);

  const [selectedActor, setSelectedActor] = createSignal<ActorEntity>(
    defaultActorList[0]
  );

  function addActor() {
    const item = {
      id: nextActorId,
      xpdlId: `newpkg_wp1_par${nextActorId}`,
      title: `アクター${nextActorId}`,
    };
    nextActorId++;
    setActorList([...actorList(), item]);
    setSelectedActor(item);
  }

  function updateActor(actor: ActorEntity) {
    const newList = actorList().map((it) => (actor.id === it.id ? actor : it));
    setActorList(newList);
  }

  function removeActor() {
    const nextSelectedIndex = Math.min(
      actorList().findIndex((it) => it.id === selectedActor().id),
      actorList().length - 2
    );
    const newList = actorList().filter((it) => it.id !== selectedActor().id);
    setActorList(newList);
    setSelectedActor(newList[nextSelectedIndex]);
  }

  return {
    actorList,
    selectedActor,
    setSelectedActor,
    addActor,
    updateActor,
    removeActor,
    defaultActor,
  };
}
