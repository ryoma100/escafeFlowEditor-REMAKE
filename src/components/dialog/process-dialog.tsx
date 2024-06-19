import { For, JSXElement, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { I18nDict, i18nEnDict } from "@/constants/i18n";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ModalDialogType } from "@/data-model/dialog-model";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import {
  ActivityNode,
  ApplicationEntity,
  EnvironmentEntity,
  ProcessDetailEntity,
  ProcessEntity,
} from "@/data-source/data-type";

const dummy = dataFactory.createProcess([]);

export function ProcessDialog(): JSXElement {
  const { dict } = useThemeContext();
  const {
    processModel: { updateProcessDetail },
    activityNodeModel: { getActivityNodes },
    dialogModel: { modalDialog: openDialog, setModalDialog: setOpenDialog, setMessageAlert },
  } = useModelContext();

  function handleFormSubmit(process: ProcessEntity) {
    const errorMessage = updateProcessDetail(process);
    if (errorMessage) {
      setMessageAlert(errorMessage);
      return;
    }
    setOpenDialog(null);
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <ProcessDialogView
      openDialog={openDialog()}
      activityList={getActivityNodes()}
      dict={dict()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
      onOpenMessageDialog={setMessageAlert}
    />
  );
}

export function ProcessDialogView(props: {
  openDialog: ModalDialogType | null;
  activityList: ActivityNode[];
  dict: I18nDict;
  onFormSubmit?: (formData: ProcessEntity) => void;
  onDialogClose?: () => void;
  onOpenMessageDialog?: (key: keyof typeof i18nEnDict) => void;
}) {
  const [formData, setFormData] = createStore<ProcessDetailEntity>(dummy.detail);
  const [selectedEnv, setSelectedEnv] = createSignal<EnvironmentEntity | null>(null);
  const [selectedApp, setSelectedApp] = createSignal<ApplicationEntity | null>(null);

  createEffect(() => {
    if (props.openDialog?.type === "process") {
      setFormData(deepUnwrap(props.openDialog.process.detail));
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleEnvClick(env: EnvironmentEntity, _e: MouseEvent) {
    setSelectedEnv(env);
  }

  function handleAddEnvButtonClick() {
    const environment = dataFactory.createEnvironment(formData.environments);
    setFormData("environments", [...formData.environments, environment]);
  }

  function handleRemoveEnvButtonClick() {
    setFormData(
      "environments",
      formData.environments.filter((it) => it.id !== selectedEnv()?.id),
    );
  }

  function handleAppClick(app: ApplicationEntity, _e: MouseEvent) {
    setSelectedApp(app);
  }

  function handleAddAppButtonClick() {
    const application = dataFactory.createApplication(formData.applications);
    setFormData("applications", [...formData.applications, application]);
  }

  function handleRemoveAppButtonClick() {
    const app = selectedApp();
    if (app) {
      if (props.activityList.some((it) => it.applications.some((app) => app.id === app.id))) {
        props.onOpenMessageDialog?.("applicationCannotDelete");
        return;
      }
      setFormData(
        "applications",
        formData.applications.filter((it) => it.id !== app.id),
      );
    }
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (props.openDialog?.type === "process") {
      const newProcess = { ...props.openDialog.process, detail: deepUnwrap(formData) };
      props.onFormSubmit?.(newProcess);
    }
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog
      class="w-[520px] bg-primary2 p-2"
      ref={dialogRef}
      onClose={() => props.onDialogClose?.()}
    >
      <h5 class="mb-2">{props.dict.editProcess}</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="grid grid-cols-[80px_220px] items-center gap-y-2">
          <p>ID:</p>
          <input
            type="text"
            value={formData.xpdlId}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <p>{props.dict.name}:</p>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData("name", e.target.value)}
          />
        </div>

        <p class="mb-1 mt-2">{props.dict.extendedSetting}:</p>
        <table class="mb-2 w-full border-collapse border border-solid border-primary3 bg-white">
          <thead class="block bg-primary3 pr-4">
            <tr>
              <td class="w-[240px] pl-1">{props.dict.name}</td>
              <td class="w-[240px] pl-1">{props.dict.value}</td>
            </tr>
          </thead>
          <tbody class="block h-[64px] overflow-x-hidden overflow-y-scroll">
            <For each={formData.environments}>
              {(it, index) => (
                <tr
                  onClick={[handleEnvClick, it]}
                  classList={{ "bg-primary1": it.id === selectedEnv()?.id }}
                >
                  <td class="w-[240px]">
                    <input
                      type="text"
                      class="ml-1 w-[228px]"
                      value={it.name}
                      onChange={(e) =>
                        setFormData("environments", [index()], "name", e.target.value)
                      }
                    />
                  </td>
                  <td class="w-[240px]">
                    <input
                      type="text"
                      class="ml-1 w-[228px]"
                      value={it.value}
                      onChange={(e) =>
                        setFormData("environments", [index()], "value", e.target.value)
                      }
                    />
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <ButtonsContainer justify="end">
          <button type="button" onClick={handleAddEnvButtonClick}>
            {props.dict.add}
          </button>
          <button type="button" onClick={handleRemoveEnvButtonClick}>
            {props.dict.delete}
          </button>
        </ButtonsContainer>

        <p>{props.dict.application}:</p>
        <table class="mb-2 mt-1 border-collapse border border-solid border-primary3 bg-white">
          <thead class="block bg-primary3 pr-4">
            <tr>
              <td class="w-[120px] pl-1">ID</td>
              <td class="w-[120px] pl-1">{props.dict.name}</td>
              <td class="w-[120px] pl-1">{props.dict.extendedName}</td>
              <td class="w-[120px] pl-1">{props.dict.extendedValue}</td>
            </tr>
          </thead>
          <tbody class="block h-[64px] overflow-x-hidden overflow-y-scroll">
            <For each={formData.applications}>
              {(it, index) => (
                <tr
                  onClick={[handleAppClick, it]}
                  classList={{ "bg-primary1": it.id === selectedApp()?.id }}
                >
                  <td class="w-[120px] pl-1">
                    <input
                      class="w-[112px]"
                      type="text"
                      value={it.xpdlId}
                      onChange={(e) =>
                        setFormData("applications", [index()], "xpdlId", e.target.value)
                      }
                    />
                  </td>
                  <td class="w-[120px] pl-1">
                    <input
                      class="w-[112px]"
                      type="text"
                      value={it.name}
                      onChange={(e) =>
                        setFormData("applications", [index()], "name", e.target.value)
                      }
                    />
                  </td>
                  <td class="w-[120px] pl-1">
                    <input
                      class="w-[112px]"
                      type="text"
                      value={it.extendedName}
                      onChange={(e) =>
                        setFormData("applications", [index()], "extendedName", e.target.value)
                      }
                    />
                  </td>
                  <td class="w-[120px] pl-1">
                    <input
                      class="w-[112px]"
                      type="text"
                      value={it.extendedValue}
                      onChange={(e) =>
                        setFormData("applications", [index()], "extendedValue", e.target.value)
                      }
                    />
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
        <ButtonsContainer justify="end">
          <button type="button" onClick={handleAddAppButtonClick}>
            {props.dict.add}
          </button>
          <button type="button" onClick={handleRemoveAppButtonClick}>
            {props.dict.delete}
          </button>
        </ButtonsContainer>

        <p>{props.dict.expireLimit}</p>
        <div class="mb-2 grid grid-cols-[80px_220px_180px] items-center gap-y-2">
          <p>From:</p>
          <input
            type="text"
            value={formData.validFrom}
            onChange={(e) => setFormData("validFrom", e.target.value)}
          />
          <p class="ml-2">{props.dict.inputExample}: 2009/1/2</p>

          <p>To:</p>
          <input
            type="text"
            value={formData.validTo}
            onChange={(e) => setFormData("validTo", e.target.value)}
          />
          <p class="ml-2">{props.dict.inputExample}: 2009/1/2</p>
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
