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
    actor: {
      actorList,
      selectedActorId,
      setSelectedActorId,
      addActor,
      removeSelectedActor,
    },
  } = useModel();

  // onClickとonDblClick両方セットすると、onDblClickが呼ばれない
  let lastClickTime: number = new Date().getTime();
  function handleItemClick(actor: ActorEntity, _: MouseEvent) {
    const time = new Date().getTime();
    if (lastClickTime + 250 < time) {
      setSelectedActorId(actor.id);
    } else {
      setOpenActorDialog(true);
    }
    lastClickTime = time;
  }

  function handleAddClick(_: MouseEvent) {
    addActor();
  }

  function handleRemoveClick(_: MouseEvent) {
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
                  "list__item--selected": it.id === selectedActorId(),
                }}
                onClick={[handleItemClick, it]}
              >
                {it.name}
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="list__buttons">
        <button onClick={handleAddClick}>追加</button>
        <button onClick={handleRemoveClick} disabled={actorList.length === 1}>
          削除
        </button>
      </div>
    </div>
  );
}
