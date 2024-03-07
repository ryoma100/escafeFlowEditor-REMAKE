import { JSXElement, createEffect } from "solid-js";
import { useAppContext } from "../../context/app-context";

export function AboutDialog(): JSXElement {
  const {
    dialog: { openAboutDialog, setOpenAboutDialog },
  } = useAppContext();

  createEffect(() => {
    if (openAboutDialog()) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleClose() {
    setOpenAboutDialog(false);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-gray-300 px-2 py-1" ref={dialogRef} onClose={handleClose}>
      <h5>tiny esFlow Diagram Editor</h5>
      <form class="my-1 bg-white p-2">
        <div>version: 0.1 beta</div>
        <div>author: Ryouichi Matsuda</div>
        <div>
          web:&nbsp;
          <a href="https://github.com/ryoma100/tiny-es-flow-editor" target="_blank">
            https://github.com/ryoma100/tiny-es-flow-editor
          </a>
        </div>
      </form>

      <div class="my-2 flex justify-center">
        <button type="button" onClick={handleClose}>
          OK
        </button>
      </div>
    </dialog>
  );
}
