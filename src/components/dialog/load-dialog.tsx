import * as i18n from "@solid-primitives/i18n";
import {} from "@tauri-apps/api";
import * as dialog from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { type JSXElement, Show, createEffect, createSignal, onMount } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { importXml } from "@/data-source/data-converter";
import type { ProjectEntity } from "@/data-source/data-type";

export function LoadDialog(): JSXElement {
  const { dialogModel, processModel, diagramModel } = useModelContext();

  function handleInput(data: string) {
    const project: ProjectEntity = importXml(data);
    loadAndAutoZoom(project);
    dialogModel.setOpenDialog(null);
  }

  function handleFileLoad() {
    if ("__TAURI_IPC__" in window) {
      tauriLoad();
    } else {
      webLoad();
    }
    dialogModel.setOpenDialog(null);
  }

  async function tauriLoad() {
    const path = await dialog.open({
      filters: [{ extensions: ["xml"], name: "*" }],
    });
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
    processModel.load(project);
    setTimeout(() => diagramModel.initViewBox(), 0);
  }

  function handleDialogClose() {
    dialogModel.setOpenDialog(null);
  }

  createEffect(() => {
    if (dialogModel.openDialog()?.type === "load") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef}>
      <Show when={dialogModel.openDialog()?.type === "load"}>
        <LoadDialogView onLoadClick={handleFileLoad} onInputClick={handleInput} onDialogClose={handleDialogClose} />
      </Show>
    </dialog>
  );
}

export function LoadDialogView(props: {
  readonly onLoadClick?: () => void;
  readonly onInputClick?: (data: string) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const [data, setData] = createSignal<string>("");

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    props.onLoadClick?.();
  }

  onMount(() => {
    loadButtonRef?.focus();
  });

  let loadButtonRef: HTMLButtonElement | undefined;
  return (
    <div class="h-[536px] w-[768px] bg-primary p-2">
      <h5 class="mb-2">{t("openXpdl")}</h5>
      <form class="bg-background p-2" onSubmit={handleFormSubmit}>
        <p class="mb-2">{t("inputXpdl")}</p>
        <textarea class="mb-2 h-[410px] w-full resize-none" value={data()} onChange={(e) => setData(e.target.value)} />
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
    </div>
  );
}
