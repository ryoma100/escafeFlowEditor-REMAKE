import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import "./dialog.css";
import { ActorEntity } from "../../data-source/data-type";
import { useAppContext } from "../../context/app-context";

export function ActorDialog() {
  const {
    actorModel: { selectedActor, updateActor },
    dialog: { openActorDialogId, setOpenActorDialogId },
  } = useAppContext();

  const [formData, setFormData] = createStore<ActorEntity>(null as any);

  createEffect(() => {
    if (openActorDialogId() > 0) {
      setFormData(selectedActor());
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    updateActor(formData);
    setOpenActorDialogId(selectedActor().id);
  }

  function handleClose() {
    setOpenActorDialogId(0);
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
