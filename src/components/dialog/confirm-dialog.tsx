import { JSXElement, createEffect } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { i18nEnDict } from "@/constants/i18n";
import { ModalDialogType, useAppContext } from "@/context/app-context";

export function ConfirmDialog(): JSXElement {
  const {
    projectModel: { initProject },
    processModel: { removeProcess },
    dialog: { modalDialog: openDialog, setModalDialog: setOpenDialog },
    i18n: { dict },
  } = useAppContext();

  function handleSubmit() {
    const dialog = openDialog();
    switch (dialog?.type) {
      case "initAll":
        initProject();
        break;
      case "deleteProcess":
        removeProcess(dialog.process);
        break;
    }
    setOpenDialog(null);
  }

  function handleClose() {
    setOpenDialog(null);
  }

  return (
    <ConfirmDialogView
      openDialog={openDialog()}
      dict={dict()}
      onFormSubmit={handleSubmit}
      onDialogClose={handleClose}
    />
  );
}

export function ConfirmDialogView(props: {
  openDialog: ModalDialogType | null;
  dict: typeof i18nEnDict;
  onFormSubmit?: () => void;
  onDialogClose?: () => void;
}) {
  createEffect(() => {
    if (props.openDialog?.type === "initAll" || props.openDialog?.type === "deleteProcess") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const message = () => {
    switch (props.openDialog?.type) {
      case "initAll":
        return props.dict.initAllConfirm;
      case "deleteProcess":
        return props.dict.deleteProcessConfirm;
      default:
        return "";
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onFormSubmit?.();
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={() => props.onDialogClose?.()}>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <p class="mb-4">{message()}</p>

        <ButtonsContainer>
          <button type="submit">OK</button>
          <button type="button" onClick={() => props.onDialogClose?.()}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
