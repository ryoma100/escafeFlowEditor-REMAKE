import * as i18n from "@solid-primitives/i18n";
import { type JSXElement, Show, createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import type { CommentNode } from "@/data-source/data-type";
import { Button } from "../parts/button";
import { Dialog } from "../parts/dialog";
import { Textarea } from "../parts/textarea";

export function CommentDialog(): JSXElement {
  const { extendNodeModel, dialogModel } = useModelContext();

  function handleFormSubmit(formData: CommentNode) {
    extendNodeModel.updateComment(deepUnwrap(formData));
    dialogModel.setOpenDialog(null);
  }

  function handleDialogClose() {
    dialogModel.setOpenDialog(null);
  }

  createEffect(() => {
    if (dialogModel.openDialog()?.type === "comment") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const comment = () => {
    const dialogData = dialogModel.openDialog();
    return dialogData?.type === "comment" ? dialogData.comment : undefined;
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <Dialog ref={dialogRef} onClose={handleDialogClose}>
      <Show when={comment()} keyed={true}>
        {(comment) => (
          <CommentDialogView comment={comment} onFormSubmit={handleFormSubmit} onDialogClose={handleDialogClose} />
        )}
      </Show>
    </Dialog>
  );
}

export function CommentDialogView(props: {
  readonly comment: CommentNode;
  readonly onFormSubmit?: (formData: CommentNode) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const dummy = dataFactory.createCommentNode([], 0, 0);
  const [formData, setFormData] = createStore<CommentNode>(dummy);
  onMount(() => {
    setFormData(deepUnwrap(props.comment));
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onFormSubmit?.(deepUnwrap(formData));
  };

  return (
    <div class="w-96 bg-primary p-2">
      <h5 class="mb-2">{t("editComment")}</h5>
      <form class="bg-background p-2" onSubmit={handleSubmit}>
        <Textarea
          class="mb-2 h-48 w-full resize-none"
          value={formData.comment}
          onChange={(e) => setFormData("comment", e.target.value)}
        />

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
