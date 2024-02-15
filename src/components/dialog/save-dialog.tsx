import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect, createSignal } from "solid-js";
import { useAppContext } from "../../context/app-context";

export function SaveDialog(): JSXElement {
  const {
    projectModel: { save },
    dialog: { openSaveDialog, setOpenSaveDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  const [data, setData] = createSignal<string>("");

  createEffect(() => {
    const project = openSaveDialog();
    if (project != null) {
      dialogRef?.showModal();
      save();
      setData(JSON.stringify(project, null, 2));
    } else {
      dialogRef?.close();
    }
  });

  function handleSaveButtonClick() {
    //

    setOpenSaveDialog(null);
  }

  function handleClose() {
    setOpenSaveDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
      <h5>{t("xpdlSave")}</h5>
      <textarea readOnly>{data()}</textarea>

      <div class="dialog__buttons">
        <button type="button" onClick={handleSaveButtonClick}>
          Save
        </button>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>
      </div>
    </dialog>
  );
}
