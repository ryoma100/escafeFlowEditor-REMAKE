import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect, createSignal } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { importXml } from "../../data-source/data-converter";
import { ProjectEntity } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

export function LoadDialog(): JSXElement {
  const {
    dialog: { openLoadDialog, setOpenLoadDialog },
    processModel: { load },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  const [data, setData] = createSignal<string>("");

  createEffect(() => {
    if (openLoadDialog()) {
      dialogRef?.showModal();
      okButtonRef?.focus();
      setData("");
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    const project: ProjectEntity = importXml(data());
    load(project);

    setOpenLoadDialog(false);
  }

  function handleClose() {
    setOpenLoadDialog(false);
  }

  let dialogRef: HTMLDialogElement | undefined;
  let okButtonRef: HTMLButtonElement | undefined;
  return (
    <dialog class="w-[512px] bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">{t("xpdlLoad")}</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <textarea
          class="mb-2 h-[512px] w-full resize-none"
          value={data()}
          onChange={(e) => setData(e.target.value)}
        />

        <ButtonsContainer>
          <button type="submit" ref={okButtonRef}>
            Load
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
