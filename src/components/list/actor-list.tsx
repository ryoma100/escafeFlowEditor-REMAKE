import { For, JSXElement } from "solid-js";
import "./list.css";
import { ActorEntity } from "../../data-source/data-type";
import { useAppContext } from "../../context/app-context";

export function ActorList(): JSXElement {
  const {
    actorModel: {
      actorList,
      selectedActor,
      setSelectedActor,
      addActor,
      removeSelectedActor,
    },
    dialog: { setOpenActorDialog },
  } = useAppContext();

  function handleItemMouseDown(actor: ActorEntity, _: MouseEvent) {
    setSelectedActor(actor);
  }

  function handleItemDblClick(_: MouseEvent) {
    setOpenActorDialog(selectedActor());
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
