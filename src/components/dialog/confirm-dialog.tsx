import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { Button } from "../parts/button";
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

  function handleOkClick() {
    switch (openConfirmDialog()) {
      case "initAll":
        initProject();
        break;
      case "deleteProcess":
        removeSelectedProcess();
        break;
    }
    handleClose();
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
    <dialog class="w-[388px] bg-gray-300 p-2" ref={dialogRef} onClose={handleClose}>
      <div class="mt-4">{dialogMessage()}</div>

      <ButtonsContainer>
        <Button onClick={handleOkClick}>OK</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </ButtonsContainer>
    </dialog>
  );
}
