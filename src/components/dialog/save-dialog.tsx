import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect, createSignal } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { exportYaml } from "../../data-source/data-converter";
import { ButtonsContainer } from "../parts/buttons-container";

export function SaveDialog(): JSXElement {
  const {
    dialog: { openSaveDialog, setOpenSaveDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  const [data, setData] = createSignal<string>("");

  createEffect(() => {
    const project = openSaveDialog();
    if (project != null) {
      dialogRef?.showModal();
      okButtonRef?.focus();
      setData(exportYaml(project));
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    //
    setOpenSaveDialog(null);
  }

  function handleClose() {
    setOpenSaveDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  let okButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog class="w-[512px] bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">{t("xpdlSave")}</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <textarea class="mb-2 h-[512px] w-full resize-none" readOnly>
          {data()}
        </textarea>

        <ButtonsContainer>
          <button type="submit" ref={okButtonRef}>
            Save
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
