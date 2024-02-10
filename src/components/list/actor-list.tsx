import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { ActorEntity } from "../../data-source/data-type";
import "./list.css";

export function ActorList(): JSXElement {
  const {
    actorModel: { actorList, selectedActor, setSelectedActor, addActor, removeSelectedActor },
    dialog: { setOpenActorDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

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
      <h5>{t("actor")}</h5>
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
        <button onClick={handleRemoveButtonClick} disabled={actorList.length === 1}>
          削除
        </button>
      </div>
    </div>
  );
}
