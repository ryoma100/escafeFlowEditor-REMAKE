import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { CommentNode } from "../../data-source/data-type";
import { Button } from "../parts/button";
import { ButtonsContainer } from "../parts/buttons-container";

export function CommentDialog(): JSXElement {
  const {
    otherNodeModel: { updateComment },
    dialog: { openCommentDialog, setOpenCommentDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<CommentNode>(undefined as never);

  createEffect(() => {
    const comment = openCommentDialog();
    if (comment != null) {
      setFormData({ ...comment });
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleOkButtonClick() {
    updateComment(formData);
    setOpenCommentDialog(null);
  }

  function handleClose() {
    setOpenCommentDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-[388px] bg-gray-300 p-2" ref={dialogRef} onClose={handleClose}>
      <h5>コメントの編集</h5>
      <form method="dialog">
        <textarea
          class="h-[128px] w-[372px]"
          value={formData.comment}
          onChange={(e) => setFormData("comment", e.target.value)}
        />

        <ButtonsContainer>
          <Button onClick={handleOkButtonClick}>OK</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </ButtonsContainer>
      </form>
    </dialog>
  );
}
