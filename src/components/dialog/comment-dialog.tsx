import * as i18n from "@solid-primitives/i18n";
import { createEffect, JSXElement } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ModalDialogType } from "@/data-model/dialog-model";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { CommentNode } from "@/data-source/data-type";

const dummy = dataFactory.createCommentNode([], 0, 0);

export function CommentDialog(): JSXElement {
  const {
    extendNodeModel: { updateComment },
    dialogModel: { modalDialog: openDialog, setModalDialog: setOpenDialog },
  } = useModelContext();

  function handleFormSubmit(formData: CommentNode) {
    updateComment(deepUnwrap(formData));
    setOpenDialog(null);
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <CommentDialogView
      openDialog={openDialog()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function CommentDialogView(props: {
  readonly openDialog: ModalDialogType | null;
  readonly onFormSubmit?: (formData: CommentNode) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const [formData, setFormData] = createStore<CommentNode>(dummy);

  createEffect(() => {
    if (props.openDialog?.type === "comment") {
      setFormData(deepUnwrap(props.openDialog.comment));
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
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={() => props.onDialogClose?.()}>
      <h5 class="mb-2">{t("editComment")}</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <textarea
          class="mb-2 h-48 w-full resize-none"
          value={formData.comment}
          onChange={(e) => setFormData("comment", e.target.value)}
        />

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
