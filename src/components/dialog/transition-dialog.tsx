import * as i18n from "@solid-primitives/i18n";
import { JSXElement, createEffect } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { TransitionEdge } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

export function TransitionDialog(): JSXElement {
  const {
    transitionModel: { transitionList, setTransitionList },
    dialog: { openTransitionDialog, setOpenTransitionDialog, setOpenMessageDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  const [formData, setFormData] = createStore<TransitionEdge>(undefined as never);

  createEffect(() => {
    const transition = openTransitionDialog();
    if (transition != null) {
      setFormData({ ...transition });
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (transitionList.some((it) => it.id !== formData.id && it.xpdlId === formData.xpdlId)) {
      setOpenMessageDialog("idExists");
      return;
    }

    setTransitionList(
      (it) => it.id === openTransitionDialog()?.id,
      produce((it) => {
        it.xpdlId = formData.xpdlId;
      }),
    );
    setOpenTransitionDialog(null);
  }

  function handleClose() {
    setOpenTransitionDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">{t("editTransition")}</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[71px_280px] items-center">
          <div>ID：</div>
          <input
            type="text"
            value={formData.xpdlId}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
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
