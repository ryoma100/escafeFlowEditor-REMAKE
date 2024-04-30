import { dialog } from "@tauri-apps/api";
import { JSXElement, createEffect, createSignal } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { enDict } from "@/constants/i18n-en";
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

  function handleFormSubmit() {
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
    });
    document.body.appendChild(input);
    input.click();
    input.remove();
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <LoadDialogView
      openDialog={openDialog()}
      dict={dict()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function LoadDialogView(props: {
  openDialog: ModalDialogType | null;
  dict: typeof enDict;
  onFormSubmit?: () => void;
  onDialogClose?: () => void;
}) {
  const [data, setData] = createSignal<string>("");

  createEffect(() => {
    if (props.openDialog?.type === "load") {
      dialogRef?.showModal();
      okButtonRef?.focus();
      setData("");
    } else {
      dialogRef?.close();
    }
  });

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    props.onFormSubmit?.();
  }

  let dialogRef: HTMLDialogElement | undefined;
  let okButtonRef: HTMLInputElement | undefined;
  return (
    <dialog
      class="h-[536px] w-[768px] bg-primary2 p-2"
      ref={dialogRef}
      onClose={() => props.onDialogClose?.()}
    >
      <h5 class="mb-2">{props.dict.xpdlLoad}</h5>
      <form class="bg-white p-2" onSubmit={handleFormSubmit}>
        <textarea
          class="mb-2 h-[436px] w-full resize-none"
          value={data()}
          onChange={(e) => setData(e.target.value)}
        />
        <ButtonsContainer>
          <button type="submit">Load</button>
          <button type="button" onClick={() => props.onDialogClose?.()}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
