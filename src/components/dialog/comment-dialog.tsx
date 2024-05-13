import { JSXElement, createEffect } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { I18nDict } from "@/constants/i18n";
import { ModalDialogType, useAppContext } from "@/context/app-context";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { CommentNode } from "@/data-source/data-type";
import { createStore } from "solid-js/store";

const dummy = dataFactory.createCommentNode([], 0, 0);

export function CommentDialog(): JSXElement {
  const {
    i18n: { dict },
    extendNodeModel: { updateComment },
    dialog: { modalDialog: openDialog, setModalDialog: setOpenDialog },
  } = useAppContext();

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
      dict={dict()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function CommentDialogView(props: {
  openDialog: ModalDialogType | null;
  dict: I18nDict;
  onFormSubmit?: (formData: CommentNode) => void;
  onDialogClose?: () => void;
}) {
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
      <h5 class="mb-2">{props.dict.editComment}</h5>
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
