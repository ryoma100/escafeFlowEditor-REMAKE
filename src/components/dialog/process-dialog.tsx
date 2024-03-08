import { For, JSXElement, createEffect } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ProcessDetailEntity, ProcessEntity } from "../../data-source/data-type";
import { ButtonsContainer } from "../parts/buttons-container";

export function ProcessDialog(): JSXElement {
  const {
    processModel: { updateProcessDetail, processList },
    activityModel: { activityList },
    dialog: { openProcessDialog, setOpenProcessDialog, setOpenMessageDialog },
  } = useAppContext();

  let process: ProcessEntity | null = null;
  const [formData, setFormData] = createStore<ProcessDetailEntity>(undefined as never);

  createEffect(() => {
    process = openProcessDialog();
    if (process != null) {
      const cloneDetail: ProcessDetailEntity = JSON.parse(JSON.stringify(process.detail));
      setFormData(cloneDetail);
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleEnvClick(id: number, _e: MouseEvent) {
    setFormData(
      "environments",
      () => true,
      produce((it) => {
        it.selected = it.id === id;
      }),
    );
  }

  function handleAddEnvButtonClick() {
    const id = formData._lastEnvironmentId + 1;
    9;
    setFormData("_lastEnvironmentId", id);
    setFormData("environments", [
      ...formData.environments,
      { id, name: `name${id}`, value: `value${id}`, selected: false },
    ]);
  }

  function handleRemoveEnvButtonClick() {
    setFormData(
      "environments",
      formData.environments.filter((it) => !it.selected),
    );
  }

  function handleAppClick(id: number, _e: MouseEvent) {
    setFormData(
      "applications",
      () => true,
      produce((it) => {
        it.selected = it.id === id;
      }),
    );
  }

  function handleAddAppButtonClick() {
    const id = formData._lastApplicationId + 1;
    setFormData("_lastApplicationId", id);
    setFormData("applications", [
      ...formData.applications,
      {
        id,
        xpdlId: `xpdlId${id}`,
        name: `name${id}`,
        extendedName: "",
        extendedValue: "",
        selected: false,
      },
    ]);
  }

  function handleRemoveAppButtonClick() {
    const selectedApp = formData.applications.find((it) => it.selected);
    if (selectedApp) {
      if (
        activityList.some((activity) =>
          activity.applications.some((app) => app.id === selectedApp.id),
        )
      ) {
        setOpenMessageDialog("applicationCannotDelete");
        return;
      }
    }

    setFormData(
      "applications",
      formData.applications.filter((it) => !it.selected),
    );
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (
      processList().some(
        (it) => it.id !== openProcessDialog()?.id && it.detail.xpdlId === formData.xpdlId,
      )
    ) {
      setOpenMessageDialog("idExists");
      return;
    }
    if (
      new Set(formData.applications.map((it) => it.xpdlId)).size !== formData.applications.length
    ) {
      setOpenMessageDialog("duplicateApplicationId");
      return;
    }

    if (process) {
      const detail = JSON.parse(JSON.stringify(formData));
      updateProcessDetail({ ...process, detail });
      setOpenProcessDialog(null);
    }
  }

  function handleClose() {
    setOpenProcessDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="w-[520px] bg-primary2 p-2" ref={dialogRef} onClose={handleClose}>
      <h5 class="mb-2">ワークフロープロセスの編集</h5>
      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="grid grid-cols-[80px_220px] items-center gap-y-2">
          <p>ID：</p>
          <input
            type="text"
            value={formData.xpdlId}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <p>名前：</p>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData("name", e.target.value)}
          />
        </div>

        <p class="mb-1 mt-2">拡張設定：</p>
        <table class="mb-2 w-full border-collapse border border-solid border-primary3 bg-white">
          <thead class="block bg-primary3 pr-4">
            <tr>
              <td class="w-[240px] pl-1">名前</td>
              <td class="w-[240px] pl-1">値</td>
            </tr>
          </thead>
          <tbody class="block h-[88px] overflow-x-hidden overflow-y-scroll">
            <For each={formData.environments}>
              {(it, index) => (
                <tr onClick={[handleEnvClick, it.id]} classList={{ "bg-primary1": it.selected }}>
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
            追加
          </button>
          <button type="button" onClick={handleRemoveEnvButtonClick}>
            削除
          </button>
        </ButtonsContainer>

        <p>アプリケーション：</p>
        <table class="mb-2 mt-1 border-collapse border border-solid border-primary3 bg-white">
          <thead class="block bg-primary3 pr-4">
            <tr>
              <td class="w-[120px] pl-1">ID</td>
              <td class="w-[120px] pl-1">名前</td>
              <td class="w-[120px] pl-1">拡張名</td>
              <td class="w-[120px] pl-1">拡張値</td>
            </tr>
          </thead>
          <tbody class="block h-[88px] overflow-x-hidden overflow-y-scroll">
            <For each={formData.applications}>
              {(it, index) => (
                <tr onClick={[handleAppClick, it.id]} classList={{ "bg-primary1": it.selected }}>
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
            追加
          </button>
          <button type="button" onClick={handleRemoveAppButtonClick}>
            削除
          </button>
        </ButtonsContainer>

        <p class="mb-2">有効期限</p>
        <div class="mb-4 grid grid-cols-[80px_220px_180px] items-center gap-y-2">
          <p>From：</p>
          <input
            type="text"
            value={formData.validFrom}
            onChange={(e) => setFormData("validFrom", e.target.value)}
          />
          <p class="ml-2">入力例：2009/1/2</p>

          <p>To：</p>
          <input
            type="text"
            value={formData.validTo}
            onChange={(e) => setFormData("validTo", e.target.value)}
          />
          <p class="ml-2">入力例：2009/1/2</p>
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
