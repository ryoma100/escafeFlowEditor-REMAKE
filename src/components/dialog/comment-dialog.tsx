import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { dataFactory } from "../../data-source/data-factory";
import { CommentNode } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

const dummy = dataFactory.createCommentNode([], 0, 0);

export function CommentDialog(): JSXElement {
  const {
    extendNodeModel: { updateComment },
    dialog: { openCommentDialog, setOpenCommentDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<CommentNode>(dummy);

  createEffect(() => {
    const comment = openCommentDialog();
    if (comment != null) {
      setFormData({ ...comment });
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    updateComment(formData);
    setOpenCommentDialog(null);
  }

  function handleClose() {
    setOpenCommentDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">コメントの編集</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <textarea
          class="mb-2 h-48 w-full resize-none"
          value={formData.comment}
          onChange={(e) => setFormData("comment", e.target.value)}
        />

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
