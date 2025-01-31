import * as i18n from "@solid-primitives/i18n";
import { For, type JSXElement } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import type { ActorEntity } from "@/data-source/data-type";

export function ActorList(): JSXElement {
  const { dict } = useThemeContext();
  const { nodeModel, actorModel, dialogModel } = useModelContext();
  const t = i18n.translator(dict);

  function handleItemMouseDown(actor: ActorEntity, _: MouseEvent) {
    if (actorModel.selectedActor().id !== actor.id) {
      actorModel.setSelectedActor(actor);
    }
  }

  function handleItemDblClick(actor: ActorEntity, _: MouseEvent) {
    dialogModel.setOpenDialog({ type: "actor", actor });
  }

  function handleAddButtonClick(_: MouseEvent) {
    actorModel.addActor();
  }

  function handleRemoveButtonClick(_: MouseEvent) {
    const errorMessage = actorModel.removeSelectedActor(nodeModel.nodeList);
    if (errorMessage != null) {
      dialogModel.setOpenMessage(errorMessage);
    }
  }

  return (
    <div class="flex h-full flex-col">
      <h5>{t("actor")}</h5>
      <div class="h-full overflow-y-auto overflow-x-hidden bg-background">
        <ul class="list-none">
          <For each={actorModel.actorList}>
            {(it) => (
              <li
                class="cursor-pointer p-1 hover:bg-primary"
                classList={{
                  "bg-primary": it.id === actorModel.selectedActor().id,
                }}
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
        <button type="button" onClick={handleRemoveButtonClick} disabled={actorModel.actorList.length === 1}>
          {t("delete")}
        </button>
      </ButtonsContainer>
    </div>
  );
}
