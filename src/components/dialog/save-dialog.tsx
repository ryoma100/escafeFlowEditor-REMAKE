import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect, createSignal } from "solid-js";

import { dialog } from "@tauri-apps/api";
import { writeTextFile } from "@tauri-apps/api/fs";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ModalDialogType } from "@/data-model/dialog-model";
import { exportXml } from "@/data-source/data-converter";

export function SaveDialog(): JSXElement {
  const {
    dialogModel: { modalDialog: openDialog, setModalDialog: setOpenDialog },
  } = useModelContext();

  function handleFormSubmit(formData: string) {
    if ("__TAURI_IPC__" in window) {
      tauriSave(formData);
    } else {
      webSave(formData);
    }
    setOpenDialog(null);
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
    setOpenDialog(null);
  }

  return (
    <SaveDialogView
      openDialog={openDialog()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function SaveDialogView(props: {
  readonly openDialog: ModalDialogType | null;
  readonly onFormSubmit?: (formData: string) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const [data, setData] = createSignal<string>("");

  createEffect(() => {
    if (props.openDialog?.type === "save") {
      dialogRef?.showModal();
      saveButtonRef?.focus();
      setData(exportXml(props.openDialog.project));
    } else {
      dialogRef?.close();
    }
  });

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    props.onFormSubmit?.(data());
  }

  let dialogRef: HTMLDialogElement | undefined;
  let saveButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog class="h-[536px] w-[768px] bg-primary2 p-2" ref={dialogRef}>
      <h5 class="mb-2">{t("saveXpdl")}</h5>
      <form class="bg-white p-2" onSubmit={handleFormSubmit}>
        <p class="mb-2">{t("copyXpdl")}</p>
        <textarea class="mb-2 h-[410px] w-full resize-none" readOnly>
          {data()}
        </textarea>

        <ButtonsContainer>
          <button type="button" ref={saveButtonRef} onClick={handleFormSubmit}>
            {t("saveFile")}
          </button>
          <button type="button" onClick={() => props.onDialogClose?.()}>
            {t("close")}
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
