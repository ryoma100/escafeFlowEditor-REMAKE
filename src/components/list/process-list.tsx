import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ProcessEntity } from "@/data-source/data-type";

export function ProcessList(): JSXElement {
  const { dict } = useThemeContext();
  const { processModel, dialogModel } = useModelContext();
  const t = i18n.translator(dict);

  function handleItemMouseDown(process: ProcessEntity, _: MouseEvent) {
    if (processModel.selectedProcess().id !== process.id) {
      processModel.changeProcess(process);
    }
  }

  function handleItemDblClick(process: ProcessEntity, _: MouseEvent) {
    dialogModel.setOpenDialog({ type: "process", process });
  }

  function handleAddButtonClick(_: MouseEvent) {
    processModel.addProcess(processModel.processList());
  }

  function handleRemoveButtonClick(_: MouseEvent) {
    dialogModel.setOpenDialog({ type: "deleteProcess", process: processModel.selectedProcess() });
  }

  return (
    <div class="flex h-full flex-col">
      <div class="h-6">
        <h5 class="leading-6">{t("process")}</h5>
      </div>
      <div class="h-full overflow-y-auto overflow-x-hidden bg-background">
        <ul class="list-none">
          <For each={processModel.processList()}>
            {(it) => (
              <li
                data-select={it.id === processModel.selectedProcess().id}
                class="cursor-pointer p-1 hover:bg-primary data-[select=true]:bg-primary"
                onPointerDown={[handleItemMouseDown, it]}
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
          disabled={processModel.processList().length === 1}
        >
          {t("delete")}
        </button>
      </ButtonsContainer>
    </div>
  );
}
