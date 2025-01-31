import * as i18n from "@solid-primitives/i18n";
import { type JSXElement, Show, createEffect } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import type { I18nDict } from "@/constants/i18n";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";

export function MessageDialog(): JSXElement {
  const { dialogModel } = useModelContext();

  function handleDialogClose() {
    dialogModel.setOpenMessage(null);
  }

  createEffect(() => {
    if (dialogModel.openMessage() != null) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleDialogClose}>
      <Show when={dialogModel.openMessage()} keyed={true}>
        {(message) => <MessageDialogView message={message} onDialogClose={handleDialogClose} />}
      </Show>
    </dialog>
  );
}

export function MessageDialogView(props: {
  readonly message: keyof I18nDict;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const handleFormSubmit = (e: Event) => {
    e.preventDefault();
    props.onDialogClose?.();
  };

  return (
    <div class="w-96 bg-primary p-2">
      <form class="bg-background p-2" onSubmit={handleFormSubmit}>
        <div class="mb-4">{t(props.message)}</div>
        <ButtonsContainer>
          <button type="submit">OK</button>
        </ButtonsContainer>
      </form>
    </div>
  );
}
