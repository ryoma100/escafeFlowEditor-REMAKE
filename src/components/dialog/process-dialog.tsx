import { createEffect } from "solid-js";
import { useDialog, useModel } from "../../context";
import { createStore } from "solid-js/store";
import { ProcessEntity } from "../../models/process-model";
import "./dialog.css";

export function ProcessDialog() {
  let dialog: HTMLDialogElement | undefined;
  const {
    process: { openProcessDialog, setOpenProcessDialog },
  } = useDialog();
  const {
    process: { selectedProcess, updateProcess, defaultProcess },
  } = useModel();

  const [form, setForm] = createStore<ProcessEntity>(defaultProcess);

  createEffect(() => {
    if (openProcessDialog()) {
      setForm({ ...selectedProcess() });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    updateProcess(form);
    setOpenProcessDialog(false);
  }

  function handleClose() {
    setOpenProcessDialog(false);
  }

  return (
    <dialog class="dialog" ref={dialog} onClose={handleClose}>
      <h5>ワークフロープロセスの編集</h5>
      <form method="dialog">
        <div class="dialog__input">
          <div>ID：</div>
          <input
            type="text"
            value={form.xpdlId}
            onInput={(e) => setForm("xpdlId", e.target.value)}
          />
          <div>名前：</div>
          <input
            type="text"
            value={form.title}
            onInput={(e) => setForm("title", e.target.value)}
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
