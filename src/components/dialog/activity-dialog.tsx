import { For, JSXElement, createEffect, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { ACTIVITY_MIN_WIDTH } from "../../constants/app-const";
import { useAppContext } from "../../context/app-context";
import { ActivityNodeEntity } from "../../data-source/data-type";
import "./dialog.css";

const dummy: ActivityNodeEntity = {
  id: 0,
  xpdlId: "",
  type: "activity",
  activityType: "manual",
  name: "",
  actorId: 0,
  ognl: "",
  joinType: "none",
  splitType: "none",
  x: 0,
  y: 0,
  width: ACTIVITY_MIN_WIDTH,
  height: 0,
  selected: false,
};

export function ActivityDialog(): JSXElement {
  const {
    actorModel: { actorList },
    activityModel: { activityList, setActivityList },
    dialog: { openActivityDialog, setOpenActivityDialog },
  } = useAppContext();

  const [formData, setFormData] = createStore<ActivityNodeEntity>(dummy);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

  createEffect(() => {
    const activity = openActivityDialog();
    if (activity != null) {
      setFormData({ ...activity });
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleXpdlIdInput(e: InputEvent) {
    const text = (e.target as HTMLInputElement).value;
    setXpdlIdError(
      activityList.some((it) => it.id !== openActivityDialog()?.id && it.xpdlId === text)
        ? "このIDは既に存在します"
        : "",
    );
  }

  function handleOkButtonClick() {
    setActivityList(
      (it) => it.id === openActivityDialog()?.id,
      produce((it) => {
        it.xpdlId = formData.xpdlId;
        it.type = formData.type;
        it.actorId = formData.actorId;
        it.name = formData.name;
      }),
    );
    setOpenActivityDialog(null);
  }

  function handleClose() {
    setOpenActivityDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog class="dialog" ref={dialogRef} onClose={handleClose}>
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
          <select onChange={(e) => setFormData("actorId", Number(e.target.value))}>
            <For each={actorList}>
              {(actor) => (
                <option value={actor.id} selected={actor.id === formData.actorId}>
                  {actor.name}
                </option>
              )}
            </For>
          </select>
          <p />
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
