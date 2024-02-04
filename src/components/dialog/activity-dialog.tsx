import { For, createEffect } from "solid-js";
import { useOperation } from "../../context/operation-context";
import { createStore, produce } from "solid-js/store";
import "./dialog.css";
import { useModel } from "../../context/model-context";
import { ActivityEntity } from "../../data-source/data-type";

export function ActivityDialog() {
  const {
    activityModel: { activityList, setActivityList },
    actorModel: { actorList },
  } = useModel();
  const {
    activity: { openActivityDialogById, setOpenActivityDialogById },
  } = useOperation();

  const [formData, setFormData] = createStore<ActivityEntity>(null as any);

  createEffect(() => {
    if (openActivityDialogById() > 0) {
      const activity = activityList.find(
        (it) => it.id === openActivityDialogById()
      )!;
      setFormData({ ...activity });
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleOkButtonClick() {
    setActivityList(
      (it) => it.id === openActivityDialogById(),
      produce((it) => {
        it.xpdlId = formData.xpdlId;
        it.type = formData.type;
        it.actorId = formData.actorId;
        it.name = formData.name;
      })
    );
    setOpenActivityDialogById(0);
  }

  function handleClose() {
    setOpenActivityDialogById(0);
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
            onInput={(e) => setFormData("xpdlId", e.target.value)}
          />
          <div>仕事名：</div>
          <input
            type="text"
            value={formData.name}
            onInput={(e) => setFormData("name", e.target.value)}
          />
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
        </div>
        <div class="dialog__buttons">
          <button type="button" onClick={handleOkButtonClick}>
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
