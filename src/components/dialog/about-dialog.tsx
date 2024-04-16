import { JSXElement, createEffect } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useAppContext } from "@/context/app-context";

export function AboutDialog(): JSXElement {
  const {
    dialog: { modalDialog: openDialog, setModalDialog: setOpenDialog },
  } = useAppContext();

  function handleClose() {
    setOpenDialog(null);
  }

  return <AboutDialogView open={openDialog()?.type === "about"} onClose={handleClose} />;
}

export function AboutDialogView(props: { open: boolean; onClose: () => void }) {
  createEffect(() => {
    if (props.open) {
      dialogRef?.showModal();
      okButtonRef?.focus();
    } else {
      dialogRef?.close();
    }
  });

  let dialogRef: HTMLDialogElement | undefined;
  let okButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={() => props.onClose()}>
      <h5 class="mb-2">tiny esFlow Diagram Editor</h5>
      <form class="my-1 bg-white p-2" onClick={() => props.onClose()}>
        <div>version: 0.1 beta</div>
        <div>author: Ryouichi Matsuda</div>
        <div class="mb-4">
          web:&nbsp;
          <a
            href="https://github.com/ryoma100/tiny-es-flow-editor"
            class="underline"
            target="_blank"
          >
            https://github.com/ryoma100/tiny-es-flow-editor
          </a>
        </div>

        <ButtonsContainer>
          <button type="submit" ref={okButtonRef}>
            OK
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
