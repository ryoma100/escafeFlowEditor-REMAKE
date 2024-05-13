import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { I18nDict } from "@/constants/i18n";
import { ModalDialogType, useAppContext } from "@/context/app-context";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { ActorEntity } from "@/data-source/data-type";

const dummy = dataFactory.createActorEntity([]);

export function ActorDialog(): JSXElement {
  const {
    i18n: { dict },
    actorModel: { updateActor },
    dialog: {
      modalDialog: openDialog,
      setModalDialog: setOpenDialog,
      setMessageAlert: setOpenMessageDialog,
    },
  } = useAppContext();

  function handleFormSubmit(formData: ActorEntity) {
    const errorMessage = updateActor(deepUnwrap(formData));
    if (errorMessage) {
      setOpenMessageDialog(errorMessage);
      return;
    }
    setOpenDialog(null);
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <ActorDialogView
      dict={dict()}
      openDialog={openDialog()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function ActorDialogView(props: {
  dict: I18nDict;
  openDialog: ModalDialogType | null;
  onFormSubmit?: (formData: ActorEntity) => void;
  onDialogClose?: () => void;
}) {
  const [formData, setFormData] = createStore<ActorEntity>(dummy);

  createEffect(() => {
    if (props.openDialog?.type === "actor") {
      setFormData(deepUnwrap(props.openDialog.actor));
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onFormSubmit?.(deepUnwrap(formData));
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog
      class="w-[388px] bg-primary2 p-2"
      ref={dialogRef}
      onClose={() => props.onDialogClose?.()}
    >
      <h5 class="mb-2">{props.dict.editActor}</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[72px_272px] gap-y-2">
          <div>ID:</div>
          <input
            type="text"
            value={formData.xpdlId}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>{props.dict.name}:</div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData("name", e.target.value)}
          />
        </div>

        <ButtonsContainer>
          <button type="submit">OK</button>
          <button type="button" onClick={() => props.onDialogClose?.()}>
            Cancel
          </button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
