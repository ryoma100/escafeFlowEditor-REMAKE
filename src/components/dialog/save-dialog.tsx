import * as i18n from "@solid-primitives/i18n";
import * as dialog from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { type JSXElement, Show, createEffect, onMount } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { exportXml } from "@/data-source/data-converter";
import type { ProjectEntity } from "@/data-source/data-type";
import { Button } from "../parts/button";
import { Textarea } from "../parts/textarea";

export function SaveDialog(): JSXElement {
  const { dialogModel } = useModelContext();

  function handleFormSubmit(formData: string) {
    if ("__TAURI_IPC__" in window) {
      tauriSave(formData);
    } else {
      webSave(formData);
    }
    dialogModel.setOpenDialog(null);
  }

  function webSave(data: string) {
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = "flow.xml";
    a.href = url;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function tauriSave(data: string) {
    const filename = "flow.xml";
    const path = await dialog.save({ defaultPath: filename });
    if (path) {
      await writeTextFile(path, data);
    }
  }

  function handleDialogClose() {
    dialogModel.setOpenDialog(null);
  }

  createEffect(() => {
    if (dialogModel.openDialog()?.type === "save") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const project = () => {
    const dialogData = dialogModel.openDialog();
    return dialogData?.type === "save" ? dialogData.project : undefined;
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleDialogClose}>
      <Show when={project()} keyed={true}>
        {(project) => (
          <SaveDialogView project={project} onFormSubmit={handleFormSubmit} onDialogClose={handleDialogClose} />
        )}
      </Show>
    </dialog>
  );
}

export function SaveDialogView(props: {
  readonly project: ProjectEntity;
  readonly onFormSubmit?: (formData: string) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const data = () => {
    return exportXml(props.project);
  };

  onMount(() => {
    saveButtonRef?.focus();
  });

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    props.onFormSubmit?.(data());
  }

  let saveButtonRef: HTMLButtonElement | undefined;
  return (
    <div class="h-[536px] w-[768px] bg-primary p-2">
      <h5 class="mb-2">{t("saveXpdl")}</h5>
      <form class="bg-background p-2" onSubmit={handleFormSubmit}>
        <p class="mb-2">{t("copyXpdl")}</p>
        <Textarea class="mb-2 h-[410px] w-full resize-none" readOnly={true}>
          {data()}
        </Textarea>

        <ButtonsContainer>
          <Button type="button" ref={saveButtonRef} onClick={handleFormSubmit}>
            {t("saveFile")}
          </Button>
          <Button type="button" onClick={() => props.onDialogClose?.()}>
            {t("close")}
          </Button>
        </ButtonsContainer>
      </form>
    </div>
  );
}
