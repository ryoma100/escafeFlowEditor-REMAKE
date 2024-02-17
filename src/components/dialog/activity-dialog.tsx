import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement, createEffect, createSignal } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ActivityNodeEntity } from "../../data-source/data-type";
import {
  AutoActivityIcon,
  AutoTimerActivityIcon,
  ManualActivityIcon,
  ManualTimerActivityIcon,
  UserActivityIcon,
} from "../icons/material-icons";
import "./dialog.css";

export function ActivityDialog(): JSXElement {
  const {
    actorModel: { actorList },
    activityModel: { activityList, setActivityList },
    dialog: { openActivityDialog, setOpenActivityDialog },
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  const [formData, setFormData] = createStore<ActivityNodeEntity>(undefined as never);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

  createEffect(() => {
    const activity = openActivityDialog();
    if (activity != null) {
      setFormData({ ...unwrap(activity) });
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function handleXpdlIdInput(e: InputEvent) {
    const text = (e.target as HTMLInputElement).value;
    setXpdlIdError(
      activityList.some((it) => it.id !== openActivityDialog()?.id && it.xpdlId === text)
        ? t("idExists")
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
      <h5>{t("editActivity")}</h5>

      <form method="dialog">
        <div class="dialog__toolbar">
          <div class="toolbar__button">
            <label for="manual-activity">
              <input
                type="radio"
                name="activityType"
                id="manual-activity"
                value="manualActivity"
                checked={formData.type === "manualActivity"}
                onChange={() => setFormData("type", "manualActivity")}
              />
              <div class="dialog__toolbar-icon" title={t("manualActivity")}>
                <ManualActivityIcon />
              </div>
            </label>
          </div>
          <div class="toolbar__button">
            <label for="auto-activity">
              <input
                type="radio"
                name="activityType"
                id="auto-activity"
                value="autoActivity"
                checked={formData.type === "autoActivity"}
                onChange={() => setFormData("type", "autoActivity")}
              />
              <div class="dialog__toolbar-icon" title={t("autoActivity")}>
                <AutoActivityIcon />
              </div>
            </label>
          </div>
          <div class="toolbar__button">
            <label for="manual-timer-activity">
              <input
                type="radio"
                name="activityType"
                id="manual-timer-activity"
                value="manualTimerActivity"
                checked={formData.type === "manualTimerActivity"}
                onChange={() => setFormData("type", "manualTimerActivity")}
              />
              <div class="dialog__toolbar-icon" title={t("manualTimerActivity")}>
                <ManualTimerActivityIcon />
              </div>
            </label>
          </div>
          <div class="toolbar__button">
            <label for="auto-timer-activity">
              <input
                type="radio"
                name="activityType"
                id="auto-timer-activity"
                value="autoTimerActivity"
                checked={formData.type === "autoTimerActivity"}
                onChange={() => setFormData("type", "autoTimerActivity")}
              />
              <div class="dialog__toolbar-icon" title={t("autoTimerActivity")}>
                <AutoTimerActivityIcon />
              </div>
            </label>
          </div>
          <div class="toolbar__button">
            <label for="user-activity">
              <input
                type="radio"
                name="activityType"
                id="user-activity"
                value="userActivity"
                checked={formData.type === "userActivity"}
                onChange={() => setFormData("type", "userActivity")}
              />
              <div class="dialog__toolbar-icon" title={t("handWork")}>
                <UserActivityIcon />
              </div>
            </label>
          </div>
        </div>

        <div class="dialog__input">
          <div>ID</div>
          <input
            type="text"
            value={formData.xpdlId}
            onInput={handleXpdlIdInput}
            onChange={(e) => setFormData("xpdlId", e.target.value)}
          />
          <p>{xpdlIdError()}</p>
          <div>{t("jobTitle")}</div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData("name", e.target.value)}
          />
          <p />
          <div>{t("actor")}</div>
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
