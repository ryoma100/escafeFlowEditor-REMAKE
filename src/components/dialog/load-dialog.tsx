import { JSXElement, createEffect, createSignal } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { enDict } from "@/constants/i18n-en";
import { ModalDialogType, useAppContext } from "@/context/app-context";
import { importXml } from "@/data-source/data-converter";
import { ProjectEntity } from "@/data-source/data-type";

export function LoadDialog(): JSXElement {
  const {
    dialog: { modalDialog: openDialog, setModalDialog: setOpenDialog },
    processModel: { load },
    i18n: { dict },
  } = useAppContext();

  function handleFormSubmit(formData: string) {
    // TODO: parse error
    const project: ProjectEntity = importXml(formData);
    load(project);
    setOpenDialog(null);
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
  onFormSubmit?: (formData: string) => void;
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
    props.onFormSubmit?.(data());
  }

  let dialogRef: HTMLDialogElement | undefined;
  let okButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog
      class="w-[512px] bg-primary2 p-2"
      ref={dialogRef}
      onClose={() => props.onDialogClose?.()}
    >
      <h5 class="mb-2">{props.dict.xpdlLoad}</h5>
      <form class="bg-white p-2" onSubmit={handleFormSubmit}>
        <textarea
          class="mb-2 h-[512px] w-full resize-none"
          value={data()}
          onChange={(e) => setData(e.target.value)}
        />

        <ButtonsContainer>
          <button type="submit" ref={okButtonRef}>
            Load
          </button>
          <button type="button" onClick={() => props.onDialogClose?.()}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
