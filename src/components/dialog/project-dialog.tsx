import * as i18n from "@solid-primitives/i18n";
import { createEffect, JSXElement, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { ProjectDetailEntity, ProjectEntity } from "@/data-source/data-type";

export function ProjectDialog(): JSXElement {
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

  createEffect(() => {
    if (openDialog()?.type === "project") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const project = () => {
    const dialogData = openDialog();
    return dialogData?.type === "project" ? dialogData.project : undefined;
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleDialogClose}>
      <Show when={project()} keyed>
        {(project) => (
          <ProjectDialogView
            project={project}
            onFormSubmit={handleFormSubmit}
            onDialogClose={handleDialogClose}
          />
        )}
      </Show>
    </dialog>
  );
}

export function ProjectDialogView(props: {
  readonly project: ProjectEntity;
  readonly onFormSubmit?: (formData: ProjectDetailEntity) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const dummy = dataFactory.createProject();
  const [formData, setFormData] = createStore<ProjectDetailEntity>(dummy.detail);

  onMount(() => {
    setFormData(deepUnwrap(props.project.detail));
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    props.onFormSubmit?.(deepUnwrap(formData));
  }

  return (
    <div class="w-96 bg-primary p-2">
      <h5 class="mb-2">{t("editPackage")}</h5>
      <form class="bg-background p-2" onSubmit={handleSubmit}>
        <div class="mb-4 grid grid-cols-[72px_272px] items-center gap-y-2">
          <div>ID:</div>
          <input
            type="text"
            value={formData.xpdlId}
            onInput={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>{t("name")}:</div>
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
    </div>
  );
}
