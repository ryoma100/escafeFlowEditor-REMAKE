import { createStore, produce } from "solid-js/store";
import { useOperation } from "../../context/operation-context";
import {
  TransitionEntity,
  defaultTransition,
} from "../../models/transition-model";
import { createEffect } from "solid-js";
import { useModel } from "../../context/model-context";

export function TransitionDialog() {
  const {
    transitionModel: { transitionList, setTransitionList },
  } = useModel();
  const {
    transition: { openTransitionDialogById, setOpenTransitionDialogId },
  } = useOperation();

  const [formData, setFormData] =
    createStore<TransitionEntity>(defaultTransition());

  createEffect(() => {
    if (openTransitionDialogById() > 0) {
      const activity = transitionList.find(
        (it) => it.id === openTransitionDialogById()
      )!;
      setFormData({ ...activity });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    setTransitionList(
      (it) => it.id === openTransitionDialogById(),
      produce((it) => {
        it.xpdlId = formData.xpdlId;
      })
    );
    setOpenTransitionDialogId(0);
  }

  function handleClose() {
    setOpenTransitionDialogId(0);
  }

  let dialog: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialog} onClose={handleClose}>
      <h5>接続の編集</h5>
      <form method="dialog">
        <div class="dialog__input">
          <div>ID：</div>
          <input
            type="text"
            value={formData.xpdlId}
            onInput={(e) => setFormData("xpdlId", e.target.value)}
          />
        </div>
        <div class="dialog__buttons">
          <button type="button" onClick={handleOkButtonClick}>
            OK
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
