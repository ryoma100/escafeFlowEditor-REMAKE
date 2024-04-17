import { JSXElement, createEffect, createSignal } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { enDict } from "@/constants/i18n-en";
import { ModalDialogType, useAppContext } from "@/context/app-context";
import { exportXml } from "@/data-source/data-converter";

export function SaveDialog(): JSXElement {
  const {
    dialog: { modalDialog: openDialog, setModalDialog: setOpenDialog },
    i18n: { dict },
  } = useAppContext();

  function handleFormSubmit(_formData: string) {
    setOpenDialog(null);
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <SaveDialogView
      openDialog={openDialog()}
      dict={dict()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function SaveDialogView(props: {
  openDialog: ModalDialogType | null;
  dict: typeof enDict;
  onFormSubmit?: (formData: string) => void;
  onDialogClose?: () => void;
}) {
  const [data, setData] = createSignal<string>("");

  createEffect(() => {
    if (props.openDialog?.type === "save") {
      dialogRef?.showModal();
      okButtonRef?.focus();
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
  let okButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog
      class="w-[512px] bg-primary2 p-2"
      ref={dialogRef}
      onClose={() => props.onDialogClose?.()}
    >
      <h5 class="mb-2">{props.dict.xpdlSave}</h5>
      <form class="bg-white p-2" onSubmit={handleFormSubmit}>
        <textarea class="mb-2 h-[512px] w-full resize-none" readOnly>
          {data()}
        </textarea>

        <ButtonsContainer>
          <button type="submit" ref={okButtonRef}>
            Save
          </button>
          <button type="button" onClick={() => props.onDialogClose?.()}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
