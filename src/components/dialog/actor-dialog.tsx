import * as i18n from "@solid-primitives/i18n";
import { type JSXElement, Show, createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import type { ActorEntity } from "@/data-source/data-type";
import { Button } from "../parts/button";
import { Input } from "../parts/input";

export function ActorDialog(): JSXElement {
  const { actorModel, dialogModel } = useModelContext();

  function handleFormSubmit(formData: ActorEntity) {
    const errorMessage = actorModel.updateActor(deepUnwrap(formData));
    if (errorMessage) {
      dialogModel.setOpenMessage(errorMessage);
      return;
    }
    dialogModel.setOpenDialog(null);
  }

  function handleDialogClose() {
    dialogModel.setOpenDialog(null);
  }

  createEffect(() => {
    if (dialogModel.openDialog()?.type === "actor") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const actor = () => {
    const dialogData = dialogModel.openDialog();
    return dialogData?.type === "actor" ? dialogData.actor : undefined;
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleDialogClose}>
      <Show when={actor()} keyed={true}>
        {(actor) => <ActorDialogView actor={actor} onFormSubmit={handleFormSubmit} onDialogClose={handleDialogClose} />}
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
          <Input type="text" value={formData.xpdlId} onChange={(e) => setFormData("xpdlId", e.target.value)} />
          <div>{t("name")}:</div>
          <Input type="text" value={formData.name} onChange={(e) => setFormData("name", e.target.value)} />
        </div>

        <ButtonsContainer>
          <Button type="submit">OK</Button>
          <Button type="button" onClick={() => props.onDialogClose?.()}>
            Cancel
          </Button>
        </ButtonsContainer>
      </form>
    </div>
  );
}
