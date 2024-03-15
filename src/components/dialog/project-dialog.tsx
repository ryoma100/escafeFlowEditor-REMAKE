import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { deepCopy } from "../../data-source/data-converter";
import { ProjectDetailEntity } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

export function ProjectDialog(): JSXElement {
  const {
    projectModel: { getProjectDetail, setProjectDetail },
    dialog: { openProjectDialog, setOpenProjectDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<ProjectDetailEntity>(undefined as never);

  createEffect(() => {
    if (openProjectDialog()) {
      setFormData(deepCopy(getProjectDetail()));
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    setProjectDetail({ ...formData });
    setOpenProjectDialog(false);
  }

  function handleClose() {
    setOpenProjectDialog(false);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">パッケージの編集</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[72px_272px] items-center gap-y-2">
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
