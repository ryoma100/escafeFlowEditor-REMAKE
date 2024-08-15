import * as i18n from "@solid-primitives/i18n";
import { createEffect, JSXElement } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { I18nDict } from "@/constants/i18n";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";

export function MessageDialog(): JSXElement {
  const {
    dialogModel: { messageAlert: openMessageDialog, setMessageAlert: setOpenMessageDialog },
  } = useModelContext();

  function handleDialogClose() {
    setOpenMessageDialog(null);
  }

  return <MessageDialogView message={openMessageDialog()} onDialogClose={handleDialogClose} />;
}

export function MessageDialogView(props: {
  readonly message: keyof I18nDict | null;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  createEffect(() => {
    if (props.message) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const handleFormSubmit = (e: Event) => {
    e.preventDefault();
    props.onDialogClose?.();
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 p-2" ref={dialogRef} onClose={() => props.onDialogClose?.()}>
      <form class="bg-background p-2" onSubmit={handleFormSubmit}>
        <div class="mb-4">{props.message ? t(props.message) : ""}</div>

        <ButtonsContainer>
          <button type="submit">OK</button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
