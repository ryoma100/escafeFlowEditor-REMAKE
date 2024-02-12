import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement, createEffect, createSignal } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";
import { ACTIVITY_MIN_WIDTH } from "../../constants/app-const";
import { useAppContext } from "../../context/app-context";
import { ActivityNodeEntity } from "../../data-source/data-type";
import {
  AutoActivityIcon,
  AutoTimeActivityIcon,
  HandActivityIcon,
  ManualActivityIcon,
  ManualTimeActivityIcon,
} from "../icons/material-icons";
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
    i18n: { dict },
  } = useAppContext();
  const t = i18n.translator(dict);

  const [formData, setFormData] = createStore<ActivityNodeEntity>(dummy);
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
      <h5>{t("jobEdit")}</h5>

      <form method="dialog">
        <div class="dialog__toolbar">
          <div class="toolbar__button">
            <label for="activity-manual">
              <input
                type="radio"
                name="activityType"
                id="activity-manual"
                value="manual"
                checked={formData.activityType === "manual"}
                onChange={() => setFormData("activityType", "manual")}
              />
              <div class="dialog__toolbar-icon" title={t("manualActivity")}>
                <ManualActivityIcon />
              </div>
            </label>
          </div>
          <div class="toolbar__button">
            <label for="activity-auto">
              <input
                type="radio"
                name="activityType"
                id="activity-auto"
                value="auto"
                checked={formData.activityType === "auto"}
                onChange={() => setFormData("activityType", "auto")}
              />
              <div class="dialog__toolbar-icon" title={t("autoActivity")}>
                <AutoActivityIcon />
              </div>
            </label>
          </div>
          <div class="toolbar__button">
            <label for="activity-manual-time">
              <input
                type="radio"
                name="activityType"
                id="activity-manual-time"
                value="auto"
                checked={formData.activityType === "auto"}
                onChange={() => setFormData("activityType", "auto")}
              />
              <div class="dialog__toolbar-icon" title={t("manualTimeLimitActivity")}>
                <ManualTimeActivityIcon />
              </div>
            </label>
          </div>
          <div class="toolbar__button">
            <label for="activity-manual-time">
              <input
                type="radio"
                name="activityType"
                id="activity-manual-time"
                value="auto"
                checked={formData.activityType === "auto"}
                onChange={() => setFormData("activityType", "auto")}
              />
              <div class="dialog__toolbar-icon" title={t("autoTimeLimitActivity")}>
                <AutoTimeActivityIcon />
              </div>
            </label>
          </div>
          <div class="toolbar__button">
            <label for="activity-hand">
              <input
                type="radio"
                name="activityType"
                id="activity-hand"
                value="hand"
                checked={formData.activityType === "hand"}
                onChange={() => setFormData("activityType", "hand")}
              />
              <div class="dialog__toolbar-icon" title={t("handWork")}>
                <HandActivityIcon />
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
