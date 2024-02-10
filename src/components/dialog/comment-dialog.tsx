import { JSXElement, createEffect } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { CommentNodeEntity } from "../../data-source/data-type";
import "./dialog.css";

const dummy: CommentNodeEntity = {
  id: 0,
  type: "comment",
  comment: "",
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  selected: false,
};

export function CommentDialog(): JSXElement {
  const {
    commentModel: { setCommentList },
    dialog: { openCommentDialog, setOpenCommentDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<CommentNodeEntity>(dummy);

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
    setCommentList(
      (it) => it.id === openCommentDialog()?.id,
      produce((it) => {
        it.comment = formData.comment;
      }),
    );
    setOpenCommentDialog(null);
  }

  function handleClose() {
    setOpenCommentDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
      <h5>コメントの編集</h5>
      <form method="dialog">
        <textarea
          class="dialog__comment"
          value={formData.comment}
          onChange={(e) => setFormData("comment", e.target.value)}
        />
        <div class="dialog__buttons">
          <button type="button" onClick={handleOkButtonClick}>
            OK
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
