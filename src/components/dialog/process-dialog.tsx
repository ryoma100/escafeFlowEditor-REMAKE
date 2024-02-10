import { JSXElement, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ProcessEntity } from "../../data-source/data-type";
import "./dialog.css";

const dummy: ProcessEntity = {
  id: 0,
  xpdlId: "",
  name: "",
  created: "",
  enviroments: [],
  validFrom: "",
  validTo: "",
  _lastActorId: 0,
  actors: [],
  _lastApplicationId: 0,
  applications: [],
  _lastActivityId: 0,
  activities: [],
  _lastTransitionId: 0,
  transitions: [],
  _lastCommentId: 0,
  comments: [],
};

export function ProcessDialog(): JSXElement {
  const {
    processModel: { updateProcess, processList },
    dialog: { openProcessDialog, setOpenProcessDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<ProcessEntity>(dummy);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

  createEffect(() => {
    const process = openProcessDialog();
    if (process != null) {
      setFormData({ ...process });
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleXpdlIdInput(e: InputEvent) {
    const text = (e.target as HTMLInputElement).value;
    setXpdlIdError(
      processList().some((it) => it.id !== openProcessDialog()?.id && it.xpdlId === text)
        ? "このIDは既に存在します"
        : "",
    );
  }

  function handleOkButtonClick() {
    updateProcess({ ...formData });
    setOpenProcessDialog(null);
  }

  function handleClose() {
    setOpenProcessDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
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
          <button type="button" onClick={handleOkButtonClick} disabled={xpdlIdError() !== ""}>
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
