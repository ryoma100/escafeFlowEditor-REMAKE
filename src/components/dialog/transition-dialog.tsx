import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { dataFactory, deepCopy } from "../../data-source/data-factory";
import { TransitionEdge } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

const dummy = dataFactory.createTransitionEdge([], 0, 0);

export function TransitionDialog(): JSXElement {
  const {
    dialog: { openDialog, setOpenDialog, setOpenMessageDialog },
    transitionEdgeModel: { updateTransitionEdge },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  const [formData, setFormData] = createStore<TransitionEdge>(dummy);
  const [showOgnl, setShowOgnl] = createSignal<boolean>(false);

  createEffect(() => {
    const dialog = openDialog();
    if (dialog?.type === "transition") {
      setFormData({ ...dialog.transition });
      setShowOgnl(dialog.transition.ognl !== "");
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    const errorMessage = updateTransitionEdge(deepCopy(formData));
    if (errorMessage) {
      setOpenMessageDialog(errorMessage);
      return;
    }

    setOpenDialog(null);
  }

  function handleClose() {
    setOpenDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">{t("editTransition")}</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[71px_280px] items-center space-y-2">
          <div>ID：</div>
          <input
            type="text"
            value={formData.xpdlId}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>接続条件</div>
          <div class="flex items-center">
            <input
              type="radio"
              id="condition-on"
              name="condition"
              class="cursor-pointer"
              checked={showOgnl()}
              onChange={() => setShowOgnl(true)}
            />
            <label for="condition-on" class="mr-2 cursor-pointer pl-1">
              あり
            </label>
            <input
              type="radio"
              id="condition-off"
              name="condition"
              class="cursor-pointer"
              checked={!showOgnl()}
              onChange={() => setShowOgnl(false)}
            />
            <label for="condition-off" class="cursor-pointer pl-1">
              なし
            </label>
          </div>
          <div classList={{ invisible: !showOgnl() }}>条件式 (OGNL)</div>
          <input
            classList={{ invisible: !showOgnl() }}
            type="text"
            value={formData.ognl}
            onChange={(e) => setFormData("ognl", e.target.value)}
          />
        </div>

        <ButtonsContainer>
          <button type="submit">OK</button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
