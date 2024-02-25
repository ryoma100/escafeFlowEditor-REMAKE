import { For, JSXElement, createEffect, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ProcessDetailEntity, ProcessEntity } from "../../data-source/data-type";
import "./dialog.css";

export function ProcessDialog(): JSXElement {
  const {
    processModel: { updateProcessDetail, processList },
    dialog: { openProcessDialog, setOpenProcessDialog },
  } = useAppContext();

  let process: ProcessEntity | null = null;
  const [formData, setFormData] = createStore<ProcessDetailEntity>(undefined as never);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

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

  function handleXpdlIdInput(e: InputEvent) {
    const text = (e.target as HTMLInputElement).value;
    setXpdlIdError(
      processList().some((it) => it.id !== openProcessDialog()?.id && it.detail.xpdlId === text)
        ? "このIDは既に存在します"
        : "",
    );
  }

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
    setFormData("_lastEnvironmentId", id);
    setFormData("environments", [
      ...formData.environments,
      { id, name: "name", value: "value", selected: false },
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
        xpdlId: "", // TODO
        name: "name",
        value: "value",
        extendedName: "",
        extendedValue: "",
        selected: false,
      },
    ]);
  }

  function handleRemoveAppButtonClick() {
    setFormData(
      "environments",
      formData.environments.filter((it) => !it.selected),
    );
  }

  function handleOkButtonClick() {
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
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
      <h5>ワークフロープロセスの編集</h5>
      <form method="dialog">
        <div class="dialog__input">
          <div>ID：</div>
          <input
            type="text"
            value={formData.xpdlId}
            onInput={handleXpdlIdInput}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <p>{xpdlIdError()}</p>

          <div>名前：</div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData("name", e.target.value)}
          />
          <p />
        </div>

        <div>拡張設定：</div>
        <table class="table">
          <thead>
            <tr class="table--tr2">
              <td>名前</td>
              <td>値</td>
            </tr>
          </thead>
          <tbody>
            <For each={formData.environments}>
              {(it, index) => (
                <tr
                  class="table--tr2"
                  onClick={[handleEnvClick, it.id]}
                  classList={{ "table__row--selected": it.selected }}
                >
                  <td>
                    <input
                      type="text"
                      value={it.name}
                      onChange={(e) =>
                        setFormData("environments", [index()], "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
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
        <div class="table__buttons">
          <button type="button" onClick={handleAddEnvButtonClick}>
            追加
          </button>
          <button type="button" onClick={handleRemoveEnvButtonClick}>
            削除
          </button>
        </div>

        <div>アプリケーション：</div>
        <table class="table">
          <thead>
            <tr class="table--tr4">
              <td>ID</td>
              <td>名前</td>
              <td>拡張名</td>
              <td>拡張値</td>
            </tr>
          </thead>
          <tbody>
            <For each={formData.applications}>
              {(it, index) => (
                <tr
                  class="table--tr4"
                  onClick={[handleAppClick, it.id]}
                  classList={{ "table__row--selected": it.selected }}
                >
                  <td>
                    <input
                      type="text"
                      value={it.name}
                      onChange={(e) =>
                        setFormData("applications", [index()], "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={it.value}
                      onChange={(e) =>
                        setFormData("applications", [index()], "value", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={it.extendedName}
                      onChange={(e) =>
                        setFormData("applications", [index()], "extendedName", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
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
        <div class="table__buttons">
          <button type="button" onClick={handleAddAppButtonClick}>
            追加
          </button>
          <button type="button" onClick={handleRemoveAppButtonClick}>
            削除
          </button>
        </div>

        <div>有効期限</div>
        <div class="dialog__input">
          <div>From：</div>
          <input
            type="text"
            value={formData.validFrom}
            onChange={(e) => setFormData("validFrom", e.target.value)}
          />
          <div>入力例：2009/1/2</div>

          <div>To：</div>
          <input
            type="text"
            value={formData.validTo}
            onChange={(e) => setFormData("validTo", e.target.value)}
          />
          <div>入力例：2009/1/2</div>
        </div>

        <div class="dialog__buttons">
          <button type="button" onClick={handleOkButtonClick} disabled={xpdlIdError() !== ""}>
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
