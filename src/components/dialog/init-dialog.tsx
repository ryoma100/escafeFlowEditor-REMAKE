import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect } from "solid-js";
import { useAppContext } from "../../context/app-context";

export function InitDialog(): JSXElement {
  const {
    projectModel: { initProject },
    dialog: { openInitDialog, setOpenInitDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  createEffect(() => {
    if (openInitDialog()) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleOkClick() {
    initProject();
    handleClose();
  }

  function handleClose() {
    setOpenInitDialog(false);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
      <div class="dialog__message">{t("initConfirm")}</div>
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
