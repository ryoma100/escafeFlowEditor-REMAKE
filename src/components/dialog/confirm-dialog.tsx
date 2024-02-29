import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect } from "solid-js";
import { useAppContext } from "../../context/app-context";

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
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
      <div class="dialog__message">{dialogMessage()}</div>
      <div class="dialog__buttons">
        <button type="button" onClick={handleOkClick}>
          OK
        </button>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </div>
    </dialog>
  );
}
