import * as i18n from "@solid-primitives/i18n";
import { createEffect, JSXElement, Show } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";

export function ConfirmDialog(): JSXElement {
  const { projectModel, processModel, dialogModel } = useModelContext();

  function handleSubmit() {
    const dialog = dialogModel.openDialog();
    if (dialog?.type === "initAll") projectModel.initProject();
    if (dialog?.type === "deleteProcess") processModel.removeProcess(dialog.process);
    dialogModel.setOpenDialog(null);
  }

  function handleClose() {
    dialogModel.setOpenDialog(null);
  }

  createEffect(() => {
    if (
      dialogModel.openDialog()?.type === "initAll" ||
      dialogModel.openDialog()?.type === "deleteProcess"
    ) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <Show when={dialogModel.openDialog()?.type} keyed>
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
