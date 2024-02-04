import { For, createEffect, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import "./dialog.css";
import { ActivityEntity } from "../../data-source/data-type";
import { useAppContext } from "../../context/app-context";

export function ActivityDialog() {
  const {
    actorModel: { actorList },
    activityModel: { activityList, setActivityList },
    dialog: { openActivityDialogId, setOpenActivityDialogId },
  } = useAppContext();

  const [formData, setFormData] = createStore<ActivityEntity>(null as any);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

  createEffect(() => {
    if (openActivityDialogId() > 0) {
      const activity = activityList.find(
        (it) => it.id === openActivityDialogId()
      )!;
      setFormData({ ...activity });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleXpdlIdInput(e: InputEvent) {
    const text = (e.target as HTMLInputElement).value;
    setXpdlIdError(
      activityList.some(
        (it) => it.id !== openActivityDialogId() && it.xpdlId === text
      )
        ? "このIDは既に存在します"
        : ""
    );
  }

  function handleOkButtonClick() {
    setActivityList(
      (it) => it.id === openActivityDialogId(),
      produce((it) => {
        it.xpdlId = formData.xpdlId;
        it.type = formData.type;
        it.actorId = formData.actorId;
        it.name = formData.name;
      })
    );
    setOpenActivityDialogId(0);
  }

  function handleClose() {
    setOpenActivityDialogId(0);
  }

  let dialog: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialog} onClose={handleClose}>
      <h5>仕事の編集</h5>
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
          <div>仕事名：</div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData("name", e.target.value)}
          />
          <p />
          <div>アクター：</div>
          <select
            onChange={(e) => setFormData("actorId", Number(e.target.value))}
          >
            <For each={actorList}>
              {(actor) => (
                <option
                  value={actor.id}
                  selected={actor.id === formData.actorId}
                >
                  {actor.name}
                </option>
              )}
            </For>
          </select>
          <p />
        </div>
        <div class="dialog__buttons">
          <button
            type="button"
            onClick={handleOkButtonClick}
            disabled={xpdlIdError() !== ""}
          >
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
