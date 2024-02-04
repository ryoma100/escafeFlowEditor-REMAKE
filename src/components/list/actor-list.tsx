import { For } from "solid-js";
import { useOperation } from "../../context/operation-context";
import "./list.css";
import { useModel } from "../../context/model-context";
import { ActorEntity } from "../../data-source/data-type";

export function ActorList() {
  const {
    actor: { setOpenActorDialog },
  } = useOperation();
  const {
    actorModel: {
      actorList,
      selectedActor,
      setSelectedActor,
      addActor,
      removeSelectedActor,
    },
  } = useModel();

  function handleItemMouseDown(actor: ActorEntity, _: MouseEvent) {
    setSelectedActor(actor);
  }

  function handleItemDblClick(_: MouseEvent) {
    setOpenActorDialog(true);
  }

  function handleAddButtonClick(_: MouseEvent) {
    addActor();
  }

  function handleRemoveButtonClick(_: MouseEvent) {
    removeSelectedActor();
  }

  return (
    <div class="list">
      <h5>アクター</h5>
      <div class="list__scroll--outer">
        <ul class="list__scroll--inner">
          <For each={actorList}>
            {(it) => (
              <li
                class="list__item"
                classList={{
                  "list__item--selected": it === selectedActor(),
                }}
                onMouseDown={[handleItemMouseDown, it]}
                onDblClick={handleItemDblClick}
              >
                {it.name}
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="list__buttons">
        <button onClick={handleAddButtonClick}>追加</button>
        <button
          onClick={handleRemoveButtonClick}
          disabled={actorList.length === 1}
        >
          削除
        </button>
      </div>
    </div>
  );
}
