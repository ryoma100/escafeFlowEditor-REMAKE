import { createStore, produce } from "solid-js/store";
import { createEffect } from "solid-js";
import { TransitionEntity } from "../../data-source/data-type";
import { useAppContext } from "../../context/app-context";

export function TransitionDialog() {
  const {
    transitionModel: { transitionList, setTransitionList },
    dialog: { openTransitionDialogId, setOpenTransitionDialogId },
  } = useAppContext();

  const [formData, setFormData] = createStore<TransitionEntity>(null as any);

  createEffect(() => {
    if (openTransitionDialogId() > 0) {
      const activity = transitionList.find(
        (it) => it.id === openTransitionDialogId()
      )!;
      setFormData({ ...activity });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    setTransitionList(
      (it) => it.id === openTransitionDialogId(),
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
