import { JSXElement, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ActorEntity } from "../../data-source/data-type";
import "./dialog.css";

export function ActorDialog(): JSXElement {
  const {
    actorModel: { updateActor, actorList },
    dialog: { openActorDialog, setOpenActorDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<ActorEntity>(null as any);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

  createEffect(() => {
    const actor = openActorDialog();
    if (actor != null) {
      setFormData(actor);
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleXpdlIdInput(e: InputEvent) {
    const text = (e.target as HTMLInputElement).value;
    setXpdlIdError(
      actorList.some((it) => it.id !== openActorDialog()?.id && it.xpdlId === text)
        ? "このIDは既に存在します"
        : "",
    );
  }

  function handleOkButtonClick() {
    updateActor(formData);
    setOpenActorDialog(null);
  }

  function handleClose() {
    setOpenActorDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
      <h5>アクターの編集</h5>
      <form method="dialog">
        <div class="dialog__input">
          <div>ID：</div>
          <input
            type="text"
            value={formData.xpdlId}
            onInput={handleXpdlIdInput}
            onchange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <p>{xpdlIdError()}</p>
          <div>名前：</div>
          <input
            type="text"
            value={formData.name}
            onchange={(e) => setFormData("name", e.target.value)}
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
