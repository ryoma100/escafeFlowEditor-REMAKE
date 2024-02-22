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
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
      <h5>tiny esFlow Diagram Editor</h5>
      <form>
        <div>version: 0.1 beta</div>
        <div>author: Ryouichi Matsuda</div>
        <div>
          web:&nbsp;
          <a href="https://github.com/ryoma100/tiny-es-flow-editor" target="_blank">
            https://github.com/ryoma100/tiny-es-flow-editor
          </a>
        </div>
      </form>

      <div class="dialog__buttons">
        <button type="button" onClick={handleClose}>
          OK
        </button>
      </div>
    </dialog>
  );
}
