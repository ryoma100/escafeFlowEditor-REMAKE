import { JSXElement, createEffect } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { ButtonsContainer } from "../parts/buttons-container";

export function AboutDialog(): JSXElement {
  const {
    dialog: { openAboutDialog, setOpenAboutDialog },
  } = useAppContext();

  createEffect(() => {
    if (openAboutDialog()) {
      dialogRef?.showModal();
      okButtonRef?.focus();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    setOpenAboutDialog(false);
  }

  function handleClose() {
    setOpenAboutDialog(false);
  }

  let dialogRef: HTMLDialogElement | undefined;
  let okButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">tiny esFlow Diagram Editor</h5>
      <form class="my-1 bg-white p-2" onClick={handleSubmit}>
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
