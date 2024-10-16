import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ActorEntity } from "@/data-source/data-type";

export function ActorList(): JSXElement {
  const { dict } = useThemeContext();
  const {
    nodeModel: { nodeList },
    actorModel: { actorList, selectedActor, setSelectedActor, addActor, removeSelectedActor },
    dialogModel: { setModalDialog: setOpenDialog, setMessageAlert: setOpenMessageDialog },
  } = useModelContext();
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
                class="cursor-pointer p-1 hover:bg-primary"
                classList={{ "bg-primary": it.id === selectedActor().id }}
                onPointerDown={[handleItemMouseDown, it]}
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
