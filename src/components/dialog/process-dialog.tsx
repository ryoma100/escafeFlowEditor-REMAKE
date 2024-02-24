import { For, JSXElement, createEffect, createSignal } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { IProcessDetailEntity } from "../../data-source/data-type";
import "./dialog.css";

export function ProcessDialog(): JSXElement {
  const {
    processModel: { updateProcessDetail, processList },
    dialog: { openProcessDialog, setOpenProcessDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<IProcessDetailEntity>(undefined as never);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

  createEffect(() => {
    const process = openProcessDialog();
    if (process != null) {
      const cloneProcess: IProcessDetailEntity = {
        id: process.id,
        xpdlId: process.xpdlId,
        name: process.name,
        validFrom: process.validFrom,
        validTo: process.validTo,
        _lastEnvironmentId: process._lastEnvironmentId,
        environments: process.environments.map((it) => ({ ...it, selected: false })),
        _lastApplicationId: process._lastApplicationId,
        applications: process.applications.map((it) => ({ ...it, selected: false })),
      };
      setFormData(cloneProcess);
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleXpdlIdInput(e: InputEvent) {
    const text = (e.target as HTMLInputElement).value;
    setXpdlIdError(
      processList().some((it) => it.id !== openProcessDialog()?.id && it.xpdlId === text)
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

  function handleOkButtonClick() {
    updateProcessDetail({
      ...formData,
      environments: unwrap(formData.environments),
      applications: unwrap(formData.applications),
    });
    setOpenProcessDialog(null);
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
            <tr>
              <td>名前</td>
              <td>値</td>
            </tr>
          </thead>
          <tbody>
            <For each={formData.environments}>
              {(it, index) => (
                <tr
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
