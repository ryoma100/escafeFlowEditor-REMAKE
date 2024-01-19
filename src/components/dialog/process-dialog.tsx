import { createEffect } from "solid-js";
import { ProcessType } from "../prosess-list/prosess-list";
import "./process-dialog.css";

export function ProcessDialog(props: {
  open: boolean;
  item: ProcessType;
  onOkButtonClick: () => void;
  onCancelButtonClick: () => void;
}) {
  let dialog: HTMLDialogElement | undefined;

  createEffect(() => {
    if (props.open) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  return (
    <dialog ref={dialog} onClose={props.onCancelButtonClick}>
      <h5>ワークフロープロセスの編集</h5>
      <form method="dialog">
        <div class="process-dialog-grid">
          <div>ID：</div>
          <input type="text" value={1} />
          <div>名前：</div>
          <input type="text" value={props.item.title} />
        </div>
        <button type="button" onClick={props.onOkButtonClick}>
          OK
        </button>
        <button type="button" onClick={props.onCancelButtonClick}>
          Cancel
        </button>
      </form>
    </dialog>
  );
}
