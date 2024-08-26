import * as i18n from "@solid-primitives/i18n";
import { dialog } from "@tauri-apps/api";
import { readTextFile } from "@tauri-apps/api/fs";
import { createEffect, createSignal, JSXElement } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ModalDialogType } from "@/data-model/dialog-model";
import { importXml } from "@/data-source/data-converter";
import { ProjectEntity } from "@/data-source/data-type";

export function LoadDialog(): JSXElement {
  const {
    dialogModel: { modalDialog: openDialog, setModalDialog: setOpenDialog },
    processModel: { load },
    diagramModel: { fitViewBox },
  } = useModelContext();

  function handleInput(data: string) {
    const project: ProjectEntity = importXml(data);
    loadAndAutoZoom(project);
    setOpenDialog(null);
  }

  function handleFileLoad() {
    if ("__TAURI_IPC__" in window) {
      tauriLoad();
    } else {
      webLoad();
    }
    setOpenDialog(null);
  }

  async function tauriLoad() {
    const path = await dialog.open({ filters: [{ extensions: ["xml"], name: "*" }] });
    if (path) {
      const data = await readTextFile(String(path));
      const project: ProjectEntity = importXml(data);
      loadAndAutoZoom(project);
    }
  }

  function webLoad() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".xml");
    input.style.display = "none";
    input.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const file = (target.files as FileList)[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        const project: ProjectEntity = importXml(String(data));
        loadAndAutoZoom(project);
      };
      reader.readAsText(file);
      input.remove();
    });
    document.body.appendChild(input);
    input.click();
  }

  function loadAndAutoZoom(project: ProjectEntity) {
    load(project);
    setTimeout(() => fitViewBox(), 0);
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <LoadDialogView
      openDialog={openDialog()}
      onLoadClick={handleFileLoad}
      onInputClick={handleInput}
      onDialogClose={handleDialogClose}
    />
  );
}

export function LoadDialogView(props: {
  readonly openDialog: ModalDialogType | null;
  readonly onLoadClick?: () => void;
  readonly onInputClick?: (data: string) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const [data, setData] = createSignal<string>("");

  createEffect(() => {
    if (props.openDialog?.type === "load") {
      dialogRef?.showModal();
      loadButtonRef?.focus();
      setData("");
    } else {
      dialogRef?.close();
    }
  });

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    props.onLoadClick?.();
  }

  let dialogRef: HTMLDialogElement | undefined;
  let loadButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog class="h-[536px] w-[768px] p-2" ref={dialogRef}>
      <h5 class="mb-2">{t("openXpdl")}</h5>
      <form class="bg-background p-2" onSubmit={handleFormSubmit}>
        <p class="mb-2">{t("inputXpdl")}</p>
        <textarea
          class="mb-2 h-[410px] w-full resize-none"
          value={data()}
          onChange={(e) => setData(e.target.value)}
        />
        <div class="flex justify-between">
          <button type="submit" ref={loadButtonRef} onClick={handleFormSubmit}>
            {t("loadFile")}
          </button>
          <ButtonsContainer>
            <button type="button" onClick={() => props.onInputClick?.(data())}>
              {t("readXpdl")}
            </button>
            <button type="button" onClick={() => props.onDialogClose?.()}>
              {t("close")}
            </button>
          </ButtonsContainer>
        </div>
      </form>
    </dialog>
  );
}
