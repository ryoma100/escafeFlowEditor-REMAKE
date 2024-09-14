import * as i18n from "@solid-primitives/i18n";
import { createEffect, JSXElement, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { ActorEntity } from "@/data-source/data-type";

export function ActorDialog(): JSXElement {
  const {
    actorModel: { updateActor },
    dialogModel: {
      modalDialog: openDialog,
      setModalDialog: setOpenDialog,
      setMessageAlert: setOpenMessageDialog,
    },
  } = useModelContext();

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

  createEffect(() => {
    if (openDialog()?.type === "actor") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const actor = () => {
    const dialogData = openDialog();
    return dialogData?.type === "actor" ? dialogData.actor : undefined;
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleDialogClose}>
      <Show when={actor()} keyed>
        {(actor) => (
          <ActorDialogView
            actor={actor}
            onFormSubmit={handleFormSubmit}
            onDialogClose={handleDialogClose}
          />
        )}
      </Show>
    </dialog>
  );
}

export function ActorDialogView(props: {
  readonly actor: ActorEntity;
  readonly onFormSubmit?: (formData: ActorEntity) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const dummy = dataFactory.createActorEntity([]);
  const [formData, setFormData] = createStore<ActorEntity>(dummy);

  onMount(() => {
    setFormData(deepUnwrap(props.actor));
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onFormSubmit?.(deepUnwrap(formData));
  };

  return (
    <div class="w-[388px] bg-primary p-2">
      <h5 class="mb-2">{t("editActor")}</h5>
      <form class="bg-background p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[72px_272px] gap-y-2">
          <div>ID:</div>
          <input
            type="text"
            value={formData.xpdlId}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>{t("name")}:</div>
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
    </div>
  );
}
