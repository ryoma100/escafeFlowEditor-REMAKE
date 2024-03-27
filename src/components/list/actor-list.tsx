import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { ActorEntity } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

export function ActorList(): JSXElement {
  const {
    nodeModel: { nodeList },
    actorModel: { actorList, selectedActor, setSelectedActor, addActor, removeSelectedActor },
    dialog: { setOpenDialog, setOpenMessageDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  function handleItemMouseDown(actor: ActorEntity, _: MouseEvent) {
    if (selectedActor().id !== actor.id) {
      setSelectedActor(actor);
    }
  }

  function handleItemDblClick(actor: ActorEntity, _: MouseEvent) {
    setOpenDialog({ type: "actor", actor });
  }

  function handleAddButtonClick(_: MouseEvent) {
    addActor();
  }

  function handleRemoveButtonClick(_: MouseEvent) {
    const errorMessage = removeSelectedActor(nodeList);
    if (errorMessage != null) {
      setOpenMessageDialog(errorMessage);
    }
  }

  return (
    <div class="flex h-full flex-col">
      <h5>{t("actor")}</h5>
      <div class="h-full overflow-y-auto overflow-x-hidden bg-background">
        <ul class="list-none">
          <For each={actorList}>
            {(it) => (
              <li
                class="p-1 hover:bg-primary2"
                classList={{ "bg-primary1": it.id === selectedActor().id }}
                onMouseDown={[handleItemMouseDown, it]}
                onDblClick={[handleItemDblClick, it]}
              >
                {it.name}
              </li>
            )}
          </For>
        </ul>
      </div>

      <ButtonsContainer margin="4px 0 0 0">
        <button type="submit" onClick={handleAddButtonClick}>
          {t("add")}
        </button>
        <button type="button" onClick={handleRemoveButtonClick} disabled={actorList.length === 1}>
          {t("delete")}
        </button>
      </ButtonsContainer>
    </div>
  );
}
