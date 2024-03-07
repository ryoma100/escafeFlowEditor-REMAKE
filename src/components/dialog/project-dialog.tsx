import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ProjectEntity } from "../../data-source/data-type";

export function ProjectDialog(): JSXElement {
  const {
    projectModel: { setProject },
    dialog: { openProjectDialog, setOpenProjectDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<ProjectEntity>(undefined as never);

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
    <dialog class="w-[388px] bg-gray-300 p-2" ref={dialogRef} onClose={handleClose}>
      <h5>パッケージの編集</h5>
      <form method="dialog" class="bg-white">
        <div class="grid grid-cols-[72px_272px] gap-x-2">
          <div>ID：</div>
          <input
            type="text"
            value={formData.xpdlId}
            onInput={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>名前：</div>
          <input
            type="text"
            value={formData.name}
            onInput={(e) => setFormData("name", e.target.value)}
          />
        </div>
        <div class="mt-4 flex justify-center gap-x-2">
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
