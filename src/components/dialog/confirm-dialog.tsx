import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useAppContext } from "@/context/app-context";

export function ConfirmDialog(): JSXElement {
  const {
    projectModel: { initProject },
    processModel: { removeProcess },
    dialog: { modalDialog: openDialog, setModalDialog: setOpenDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  createEffect(() => {
    const dialog = openDialog();
    if (dialog?.type === "initAll" || dialog?.type === "deleteProcess") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

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

  const dialogMessage = () => {
    switch (openDialog()?.type) {
      case "initAll":
        return t("initAllConfirm");
      case "deleteProcess":
        return t("deleteProcessConfirm");
      default:
        return "";
    }
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <p class="mb-4">{dialogMessage()}</p>

        <ButtonsContainer>
          <button type="submit">OK</button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
