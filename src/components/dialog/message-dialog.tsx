import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect } from "solid-js";
import { useAppContext } from "../../context/app-context";

export function MessageDialog(): JSXElement {
  const {
    dialog: { openMessageDialog, setOpenMessageDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  createEffect(() => {
    if (openMessageDialog() != null) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleClose() {
    setOpenMessageDialog(null);
  }

  const message = () => {
    const key = openMessageDialog();
    return key != null ? t(key) : "";
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-[388px] bg-gray-300 p-2" ref={dialogRef} onClose={handleClose}>
      <div class="mt-4">{message()}</div>
      <div class="mt-4 flex justify-center gap-x-2">
        <button type="button" onClick={handleClose}>
          OK
        </button>
      </div>
    </dialog>
  );
}
