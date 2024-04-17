import * as i18n from "@solid-primitives/i18n";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useAppContext } from "@/context/app-context";
import { JSXElement, createEffect } from "solid-js";

export function MessageDialog(): JSXElement {
  const {
    dialog: { messageAlert: openMessageDialog, setMessageAlert: setOpenMessageDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  function handleDialogClose() {
    setOpenMessageDialog(null);
  }

  const message = () => {
    const key = openMessageDialog();
    return key != null ? t(key) : "";
  };

  return <MessageDialogView message={message()} onDialogClose={handleDialogClose} />;
}

export function MessageDialogView(props: { message: string; onDialogClose?: () => void }) {
  createEffect(() => {
    if (props.message !== "") {
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
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={() => props.onDialogClose?.()}>
      <form class="bg-white p-2" onSubmit={handleFormSubmit}>
        <div class="mb-4">{props.message}</div>

        <ButtonsContainer>
          <button type="submit">OK</button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
