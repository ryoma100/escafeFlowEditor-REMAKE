import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ActorEntity } from "../../data-source/data-type";
import { Button } from "../parts/button";
import { ButtonsContainer } from "../parts/buttons-container";

export function ActorDialog(): JSXElement {
  const {
    actorModel: { updateActor, actorList },
    dialog: { openActorDialog, setOpenActorDialog, setOpenMessageDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<ActorEntity>(undefined as never);
  createEffect(() => {
    const actor = openActorDialog();
    if (actor != null) {
      setFormData(actor);
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleOkButtonClick() {
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
    <dialog class="w-[388px] bg-gray-300 px-2 py-1" ref={dialogRef} onClose={handleClose}>
      <h5>アクターの編集</h5>
      <form method="dialog">
        <div class="my-1 grid grid-cols-[72px_272px] bg-white p-2">
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
          <Button onClick={handleOkButtonClick}>OK</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
