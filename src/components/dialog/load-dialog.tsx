import { dialog } from "@tauri-apps/api";
import { JSXElement, createEffect, createSignal } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { I18nDict } from "@/constants/i18n";
import { ModalDialogType, useAppContext } from "@/context/app-context";
import { importXml } from "@/data-source/data-converter";
import { ProjectEntity } from "@/data-source/data-type";
import { readTextFile } from "@tauri-apps/api/fs";

export function LoadDialog(): JSXElement {
  const {
    dialog: { modalDialog: openDialog, setModalDialog: setOpenDialog },
    processModel: { load },
    i18n: { dict },
  } = useAppContext();

  function handleInput(data: string) {
    const project: ProjectEntity = importXml(data);
    load(project);
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
      load(project);
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
        load(project);
      };
      reader.readAsText(file);
      input.remove();
    });
    document.body.appendChild(input);
    input.click();
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <LoadDialogView
      openDialog={openDialog()}
      dict={dict()}
      onLoadClick={handleFileLoad}
      onInputClick={handleInput}
      onDialogClose={handleDialogClose}
    />
  );
}

export function LoadDialogView(props: {
  openDialog: ModalDialogType | null;
  dict: I18nDict;
  onLoadClick?: () => void;
  onInputClick?: (data: string) => void;
  onDialogClose?: () => void;
}) {
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
    <dialog class="h-[536px] w-[768px] bg-primary2 p-2" ref={dialogRef}>
      <h5 class="mb-2">{props.dict.openXpdl}</h5>
      <form class="bg-white p-2" onSubmit={handleFormSubmit}>
        <p class="mb-2">{props.dict.inputXpdl}</p>
        <textarea
          class="mb-2 h-[410px] w-full resize-none"
          value={data()}
          onChange={(e) => setData(e.target.value)}
        />
        <div class="flex justify-between">
          <button type="submit" ref={loadButtonRef} onClick={handleFormSubmit}>
            {props.dict.loadFile}
          </button>
          <ButtonsContainer>
            <button type="button" onClick={() => props.onInputClick?.(data())}>
              {props.dict.readXpdl}
            </button>
            <button type="button" onClick={() => props.onDialogClose?.()}>
              {props.dict.close}
            </button>
          </ButtonsContainer>
        </div>
      </form>
    </dialog>
  );
}
