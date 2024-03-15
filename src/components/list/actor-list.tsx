import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { ActorEntity } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

export function ActorList(): JSXElement {
  const {
    processModel: { selectedProcess },
    nodeModel: { nodeList },
    actorModel: { actorList, selectedActor, setSelectedActor, addActor, removeSelectedActor },
    dialog: { setOpenActorDialog, setOpenMessageDialog },
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
    addActor(selectedProcess());
  }

  function handleRemoveButtonClick(_: MouseEvent) {
    const err = removeSelectedActor(nodeList);
    if (err != null) {
      setOpenMessageDialog(err);
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
                data-select={it.id === selectedActor().id}
                class="p-1 hover:bg-primary2 data-[select=true]:bg-primary1"
                onMouseDown={[handleItemMouseDown, it]}
                onDblClick={handleItemDblClick}
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
