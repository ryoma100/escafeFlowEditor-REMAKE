import { createStore, produce } from "solid-js/store";
import { JSXElement, createEffect, createSignal } from "solid-js";
import { TransitionEntity } from "../../data-source/data-type";
import { useAppContext } from "../../context/app-context";

export function TransitionDialog(): JSXElement {
  const {
    transitionModel: { transitionList, setTransitionList },
    dialog: { openTransitionDialog, setOpenTransitionDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<TransitionEntity>(null as any);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

  createEffect(() => {
    const transition = openTransitionDialog();
    if (transition != null) {
      setFormData({ ...transition });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    setTransitionList(
      (it) => it.id === formData.id,
      produce((it) => {
        it.xpdlId = formData.xpdlId;
      })
    );
    setOpenTransitionDialog(null);
  }

  function handleXpdlIdInput(e: InputEvent) {
    const text = (e.target as HTMLInputElement).value;
    setXpdlIdError(
      transitionList.some(
        (it) => it.id !== openTransitionDialog()?.id && it.xpdlId === text
      )
        ? "このIDは既に存在します"
        : ""
    );
  }

  function handleClose() {
    setOpenTransitionDialog(null);
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
            onInput={handleXpdlIdInput}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <p>{xpdlIdError()}</p>
        </div>
        <div class="dialog__buttons">
          <button
            type="button"
            onClick={handleOkButtonClick}
            disabled={xpdlIdError() !== ""}
          >
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
