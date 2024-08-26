import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ProcessEntity } from "@/data-source/data-type";

export function ProcessList(): JSXElement {
  const { dict } = useThemeContext();
  const {
    processModel: { processList, selectedProcess, addProcess, changeProcess },
    dialogModel: { setModalDialog: setOpenDialog },
  } = useModelContext();
  const t = i18n.translator(dict);

  function handleItemMouseDown(process: ProcessEntity, _: MouseEvent) {
    if (selectedProcess().id !== process.id) {
      changeProcess(process);
    }
  }

  function handleItemDblClick(process: ProcessEntity, _: MouseEvent) {
    setOpenDialog({ type: "process", process });
  }

  function handleAddButtonClick(_: MouseEvent) {
    addProcess(processList());
  }

  function handleRemoveButtonClick(_: MouseEvent) {
    setOpenDialog({ type: "deleteProcess", process: selectedProcess() });
  }

  return (
    <div class="flex h-full flex-col">
      <div class="h-6">
        <h5 class="leading-6">{t("process")}</h5>
      </div>
      <div class="h-full overflow-y-auto overflow-x-hidden bg-background">
        <ul class="list-none">
          <For each={processList()}>
            {(it) => (
              <li
                data-select={it.id === selectedProcess().id}
                class="cursor-pointer p-1 hover:bg-primary data-[select=true]:bg-primary"
                onMouseDown={[handleItemMouseDown, it]}
                onDblClick={[handleItemDblClick, it]}
              >
                {it.detail.name}
              </li>
            )}
          </For>
        </ul>
      </div>

      <ButtonsContainer margin="4px 0 0 0">
        <button type="submit" onClick={handleAddButtonClick}>
          {t("add")}
        </button>
        <button
          type="button"
          onClick={handleRemoveButtonClick}
          disabled={processList().length === 1}
        >
          {t("delete")}
        </button>
      </ButtonsContainer>
    </div>
  );
}
