import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { ButtonsContainer } from "../parts/buttons-container";

export function ConfirmDialog(): JSXElement {
  const {
    projectModel: { initProject },
    processModel: { removeSelectedProcess },
    dialog: { openConfirmDialog, setOpenConfirmDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  createEffect(() => {
    if (openConfirmDialog() != null) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    switch (openConfirmDialog()) {
      case "initAll":
        initProject();
        break;
      case "deleteProcess":
        removeSelectedProcess();
        break;
    }
    setOpenConfirmDialog(null);
  }

  function handleClose() {
    setOpenConfirmDialog(null);
  }

  const dialogMessage = () => {
    switch (openConfirmDialog()) {
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
