import * as i18n from "@solid-primitives/i18n";
import { createEffect, createSignal, For, JSXElement, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { i18nEnDict } from "@/constants/i18n";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import {
  ActivityNode,
  ApplicationEntity,
  EnvironmentEntity,
  ProcessDetailEntity,
  ProcessEntity,
} from "@/data-source/data-type";

export function ProcessDialog(): JSXElement {
  const { processModel, activityNodeModel, dialogModel } = useModelContext();

  function handleFormSubmit(process: ProcessEntity) {
    const errorMessage = processModel.updateProcessDetail(process);
    if (errorMessage) {
      dialogModel.setOpenMessage(errorMessage);
      return;
    }
    dialogModel.setOpenDialog(null);
  }

  function handleDialogClose() {
    dialogModel.setOpenDialog(null);
  }

  createEffect(() => {
    if (dialogModel.openDialog()?.type === "process") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const process = () => {
    const dialogData = dialogModel.openDialog();
    return dialogData?.type === "process" ? dialogData.process : undefined;
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleDialogClose}>
      <Show when={process()} keyed>
        {(process) => (
          <ProcessDialogView
            process={process}
            activityList={activityNodeModel.getActivityNodes()}
            onFormSubmit={handleFormSubmit}
            onDialogClose={handleDialogClose}
            onOpenMessageDialog={dialogModel.setOpenMessage}
          />
        )}
      </Show>
    </dialog>
  );
}

export function ProcessDialogView(props: {
  readonly process: ProcessEntity;
  readonly activityList: ActivityNode[];
  readonly onFormSubmit?: (formData: ProcessEntity) => void;
  readonly onDialogClose?: () => void;
  readonly onOpenMessageDialog?: (key: keyof typeof i18nEnDict) => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const dummy = dataFactory.createProcess([]);
  const [formData, setFormData] = createStore<ProcessDetailEntity>(dummy.detail);
  const [selectedEnv, setSelectedEnv] = createSignal<EnvironmentEntity | null>(null);
  const [selectedApp, setSelectedApp] = createSignal<ApplicationEntity | null>(null);

  onMount(() => {
    setFormData(deepUnwrap(props.process.detail));
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

    const newProcess = { ...props.process, detail: deepUnwrap(formData) };
    props.onFormSubmit?.(newProcess);
  }

  return (
    <div class="w-[520px] bg-primary p-2">
      <h5 class="mb-2">{t("editProcess")}</h5>
      <form class="bg-background p-2" onSubmit={handleSubmit}>
        <div class="grid grid-cols-[80px_220px] items-center gap-y-2">
          <p>ID:</p>
          <input
            type="text"
            value={formData.xpdlId}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <p>{t("name")}:</p>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData("name", e.target.value)}
          />
        </div>

        <p class="mb-1 mt-2">{t("extendedSetting")}:</p>
        <table class="mb-2 w-full border border-solid border-secondary bg-background">
          <thead class="block bg-secondary pr-4">
            <tr>
              <td class="w-[240px] pl-1">{t("name")}</td>
              <td class="w-[240px] pl-1">{t("value")}</td>
            </tr>
          </thead>
          <tbody class="block h-[64px] overflow-x-hidden overflow-y-scroll">
            <For each={formData.environments}>
              {(it, index) => (
                <tr
                  onClick={[handleEnvClick, it]}
                  classList={{ "bg-primary": it.id === selectedEnv()?.id }}
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
            {t("add")}
          </button>
          <button type="button" onClick={handleRemoveEnvButtonClick}>
            {t("delete")}
          </button>
        </ButtonsContainer>

        <p>{t("application")}:</p>
        <table class="mb-2 w-full border border-solid border-secondary bg-background">
          <thead class="block bg-secondary pr-4">
            <tr>
              <td class="w-[120px] pl-1">ID</td>
              <td class="w-[120px] pl-1">{t("name")}</td>
              <td class="w-[120px] pl-1">{t("extendedName")}</td>
              <td class="w-[120px] pl-1">{t("extendedValue")}</td>
            </tr>
          </thead>
          <tbody class="block h-[64px] overflow-x-hidden overflow-y-scroll">
            <For each={formData.applications}>
              {(it, index) => (
                <tr
                  onClick={[handleAppClick, it]}
                  classList={{ "bg-primary": it.id === selectedApp()?.id }}
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
            {t("add")}
          </button>
          <button type="button" onClick={handleRemoveAppButtonClick}>
            {t("delete")}
          </button>
        </ButtonsContainer>

        <p>{t("expireLimit")}</p>
        <div class="mb-2 grid grid-cols-[80px_220px_180px] items-center gap-y-2">
          <p>From:</p>
          <input
            type="text"
            value={formData.validFrom}
            onChange={(e) => setFormData("validFrom", e.target.value)}
          />
          <p class="ml-2">{t("inputExample")}: 2009/1/2</p>

          <p>To:</p>
          <input
            type="text"
            value={formData.validTo}
            onChange={(e) => setFormData("validTo", e.target.value)}
          />
          <p class="ml-2">{t("inputExample")}: 2009/1/2</p>
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
