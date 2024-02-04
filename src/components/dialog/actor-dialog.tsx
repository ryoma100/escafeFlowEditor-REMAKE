import { createEffect } from "solid-js";
import { useOperation } from "../../context/operation-context";
import { createStore } from "solid-js/store";
import "./dialog.css";
import { useModel } from "../../context/model-context";
import { ActorEntity } from "../../data-source/data-type";

export function ActorDialog() {
  const {
    actor: { openActorDialog, setOpenActorDialog },
  } = useOperation();
  const {
    actorModel: { selectedActor, updateActor },
  } = useModel();

  const [formData, setFormData] = createStore<ActorEntity>(null as any);

  createEffect(() => {
    if (openActorDialog()) {
      setFormData(selectedActor());
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    updateActor(formData);
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
            value={formData.name}
            onInput={(e) => setFormData("name", e.target.value)}
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
