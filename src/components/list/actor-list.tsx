import { For, Match, Switch } from "solid-js";
import { useOperation } from "../../context/operation-context";
import "./list.css";
import { ActorEntity } from "../../models/actor-model";
import { useModel } from "../../context/model-context";

export function ActorList() {
  const {
    actor: { setOpenActorDialog },
  } = useOperation();
  const {
    actor: {
      actorList,
      selectedActor,
      setSelectedActor,
      addActor,
      removeActor,
    },
  } = useModel();

  // onClickとonDblClick両方セットすると、onDblClickが呼ばれない
  let lastClickTime: number = new Date().getTime();
  function handleItemClick(item: ActorEntity, _: MouseEvent) {
    const time = new Date().getTime();
    if (lastClickTime + 250 < time) {
      setSelectedActor(item);
    } else {
      setOpenActorDialog(true);
    }
    lastClickTime = time;
  }

  function handleAddClick(_: MouseEvent) {
    addActor();
  }

  function handleRemoveClick(_: MouseEvent) {
    removeActor();
  }

  return (
    <div class="list">
      <h5>アクター</h5>
      <div class="list__scroll--outer">
        <ul class="list__scroll--inner">
          <For each={actorList()}>
            {(item) => (
              <Switch>
                <Match when={item.id === selectedActor().id}>
                  <li
                    class="list__item list__item--selected"
                    onClick={[handleItemClick, item]}
                  >
                    {item.title}
                  </li>
                </Match>
                <Match when={item.id !== selectedActor().id}>
                  <li class="list__item" onClick={[handleItemClick, item]}>
                    {item.title}
                  </li>
                </Match>
              </Switch>
            )}
          </For>
        </ul>
      </div>
      <div class="list__buttons">
        <button onClick={handleAddClick}>追加</button>
        <button onClick={handleRemoveClick} disabled={actorList().length === 1}>
          削除
        </button>
      </div>
    </div>
  );
}
