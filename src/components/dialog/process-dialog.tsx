import { JSXElement, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import "./dialog.css";
import { ProcessEntity } from "../../data-source/data-type";
import { useAppContext } from "../../context/app-context";

export function ProcessDialog(): JSXElement {
  const {
    processModel: { updateProcess, processList },
    dialog: { openProcessDialog, setOpenProcessDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<ProcessEntity>(null as any);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

  createEffect(() => {
    const process = openProcessDialog();
    if (process != null) {
      setFormData({ ...process });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleXpdlIdInput(e: InputEvent) {
    const text = (e.target as HTMLInputElement).value;
    setXpdlIdError(
      processList().some(
        (it) => it.id !== openProcessDialog()?.id && it.xpdlId === text
      )
        ? "このIDは既に存在します"
        : ""
    );
  }

  function handleOkButtonClick() {
    updateProcess({ ...formData });
    setOpenProcessDialog(null);
  }

  function handleClose() {
    setOpenProcessDialog(null);
  }

  let dialog: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialog} onClose={handleClose}>
      <h5>ワークフロープロセスの編集</h5>
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
          <div>名前：</div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData("name", e.target.value)}
          />
          <p />
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
