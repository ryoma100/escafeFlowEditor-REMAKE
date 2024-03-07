import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect, createSignal } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { Button } from "../parts/button";
import { ButtonsContainer } from "../parts/buttons-container";

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
    <dialog class="w-[388px] bg-gray-300 p-2" ref={dialogRef} onClose={handleClose}>
      <h5>{t("xpdlSave")}</h5>
      <textarea class="h-[300px] w-[368px]" readOnly>
        {data()}
      </textarea>

      <ButtonsContainer>
        <Button onClick={handleSaveButtonClick}>Save</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </ButtonsContainer>
    </dialog>
  );
}
