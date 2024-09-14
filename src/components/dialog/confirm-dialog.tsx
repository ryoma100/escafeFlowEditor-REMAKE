import * as i18n from "@solid-primitives/i18n";
import { createEffect, JSXElement, Show } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";

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

  createEffect(() => {
    if (openDialog()?.type === "initAll" || openDialog()?.type === "deleteProcess") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <Show when={openDialog()?.type} keyed>
        {(type) => (
          <ConfirmDialogView type={type} onFormSubmit={handleSubmit} onDialogClose={handleClose} />
        )}
      </Show>
    </dialog>
  );
}

export function ConfirmDialogView(props: {
  readonly type: string;
  readonly onFormSubmit?: () => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const message = () => {
    switch (props.type) {
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

  return (
    <div class="w-96 bg-primary p-2">
      <form class="bg-background p-2" onSubmit={handleSubmit}>
        <p class="mb-4">{message()}</p>

        <ButtonsContainer>
          <button type="submit">OK</button>
          <button type="button" onClick={() => props.onDialogClose?.()}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </div>
  );
}
