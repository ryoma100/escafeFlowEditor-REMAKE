import { createEffect } from "solid-js";
import { useOperation, useModel } from "../../context";
import { createStore } from "solid-js/store";
import { ProcessEntity } from "../../models/process-model";
import "./dialog.css";

export function ProcessDialog() {
  const {
    process: { openProcessDialog, setOpenProcessDialog },
  } = useOperation();
  const {
    process: { selectedProcess, updateProcess, defaultProcess },
  } = useModel();

  const [formData, setFormData] = createStore<ProcessEntity>(defaultProcess());

  createEffect(() => {
    if (openProcessDialog()) {
      setFormData({ ...selectedProcess() });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    updateProcess({ ...formData }); //TODO:コピーしないと別のプロセスが上書きされる？
    setOpenProcessDialog(false);
  }

  function handleClose() {
    setOpenProcessDialog(false);
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
            onInput={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>名前：</div>
          <input
            type="text"
            value={formData.title}
            onInput={(e) => setFormData("title", e.target.value)}
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
