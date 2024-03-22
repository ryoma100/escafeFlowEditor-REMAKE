import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { dataFactory } from "../../data-source/data-factory";
import { ActorEntity } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

const dummy = dataFactory.createActorEntity([]);

export function ActorDialog(): JSXElement {
  const {
    actorModel: { updateActor, actorList },
    dialog: { openActorDialog, setOpenActorDialog, setOpenMessageDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<ActorEntity>(dummy);
  createEffect(() => {
    const actor = openActorDialog();
    if (actor != null) {
      setFormData(actor);
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (actorList.some((it) => it.id !== openActorDialog()?.id && it.xpdlId === formData.xpdlId)) {
      setOpenMessageDialog("idExists");
      return;
    }

    updateActor(formData);
    setOpenActorDialog(null);
  }

  function handleClose() {
    setOpenActorDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-[388px] bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">アクターの編集</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[72px_272px] gap-y-2">
          <div>ID：</div>
          <input
            type="text"
            value={formData.xpdlId}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>名前：</div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData("name", e.target.value)}
          />
        </div>

        <ButtonsContainer>
          <button type="submit">OK</button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
