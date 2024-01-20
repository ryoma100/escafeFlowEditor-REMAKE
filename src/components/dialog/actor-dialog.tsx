import { createEffect } from "solid-js";
import { useDialog, useModel } from "../../context";
import { createStore } from "solid-js/store";
import { ActorEntity } from "../../models/actor-model";
import "./dialog.css";

export function ActorDialog() {
  const {
    actor: { openActorDialog, setOpenActorDialog },
  } = useDialog();
  const {
    actor: { selectedActor, updateActor, defaultActor },
  } = useModel();

  const [formData, setFormData] = createStore<ActorEntity>(defaultActor());

  createEffect(() => {
    if (openActorDialog()) {
      setFormData({ ...selectedActor() });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    updateActor({ ...formData }); //TODO:コピーしないと別のプロセスが上書きされる？
    setOpenActorDialog(false);
  }

  function handleClose() {
    setOpenActorDialog(false);
  }

  let dialog: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialog} onClose={handleClose}>
      <h5>アクターの編集</h5>
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
