import { JSXElement, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { I18nDict } from "@/constants/i18n";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ModalDialogType } from "@/data-model/dialog-model";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { ProjectDetailEntity } from "@/data-source/data-type";

const dummy = dataFactory.createProject();

export function ProjectDialog(): JSXElement {
  const { dict } = useThemeContext();
  const {
    projectModel: { setProjectDetail },
    dialogModel: { modalDialog: openDialog, setModalDialog: setOpenDialog },
  } = useModelContext();

  function handleFormSubmit(formData: ProjectDetailEntity) {
    setProjectDetail(formData);
    setOpenDialog(null);
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <ProjectDialogView
      openDialog={openDialog()}
      dict={dict()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function ProjectDialogView(props: {
  openDialog: ModalDialogType | null;
  dict: I18nDict;
  onFormSubmit?: (formData: ProjectDetailEntity) => void;
  onDialogClose?: () => void;
}) {
  const [formData, setFormData] = createStore<ProjectDetailEntity>(dummy.detail);

  createEffect(() => {
    if (props.openDialog?.type === "project") {
      setFormData(deepUnwrap(props.openDialog.project.detail));
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    props.onFormSubmit?.(deepUnwrap(formData));
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-96 bg-primary2 p-2" ref={dialogRef} onClose={() => props.onDialogClose?.()}>
      <h5 class="mb-2">{props.dict.editPackage}</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[72px_272px] items-center gap-y-2">
          <div>ID:</div>
          <input
            type="text"
            value={formData.xpdlId}
            onInput={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>{props.dict.name}:</div>
          <input
            type="text"
            value={formData.name}
            onInput={(e) => setFormData("name", e.target.value)}
          />
        </div>

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
