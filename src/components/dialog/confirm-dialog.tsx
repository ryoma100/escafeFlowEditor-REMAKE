import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ModalDialogType } from "@/data-model/dialog-model";

export function ConfirmDialog(): JSXElement {
  const {
    projectModel: { initProject },
    processModel: { removeProcess },
    dialogModel: { modalDialog: openDialog, setModalDialog: setOpenDialog },
  } = useModelContext();

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
      onFormSubmit={handleSubmit}
      onDialogClose={handleClose}
    />
  );
}

export function ConfirmDialogView(props: {
  readonly openDialog: ModalDialogType | null;
  readonly onFormSubmit?: () => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

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
        return t("initAllConfirm");
      case "deleteProcess":
        return t("deleteProcessConfirm");
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
