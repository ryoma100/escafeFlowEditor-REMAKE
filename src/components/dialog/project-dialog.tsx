import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import "./dialog.css";
import { useAppContext } from "../../context/app-context";
import { ProjectEntity } from "../../data-source/data-type";

export function ProjectDialog(): JSXElement {
  const {
    projectModel: { setProject },
    dialog: { openProjectDialog, setOpenProjectDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<ProjectEntity>(null as any);

  createEffect(() => {
    const project = openProjectDialog();
    if (project != null) {
      setFormData({ ...project });
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleOkButtonClick() {
    setProject({ ...formData });
    setOpenProjectDialog(null);
  }

  function handleClose() {
    setOpenProjectDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
      <h5>パッケージの編集</h5>
      <form method="dialog">
        <div class="dialog__input">
          <div>ID：</div>
          <input
            type="text"
            value={formData.xpdlId}
            onInput={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div />
          <div>名前：</div>
          <input
            type="text"
            value={formData.name}
            onInput={(e) => setFormData("name", e.target.value)}
          />
          <div />
        </div>
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
