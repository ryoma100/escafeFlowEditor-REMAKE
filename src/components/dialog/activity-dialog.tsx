import * as i18n from "@solid-primitives/i18n";
import { For, JSXElement, Match, Switch, createEffect, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useAppContext } from "../../context/app-context";
import { ActivityNode } from "../../data-source/data-type";
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

  const [formData, setFormData] = createStore<ActivityNode>(undefined as never);
  const [xpdlIdError, setXpdlIdError] = createSignal("");

  createEffect(() => {
    const activity = openActivityDialog();
    if (activity != null) {
      setFormData(JSON.parse(JSON.stringify(activity)));
      dialogRef?.showModal();
      if (radioTabCenterRef) {
        radioTabCenterRef.checked = true;
      }
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
        it.joinType = formData.joinType;
        it.splitType = formData.splitType;
      }),
    );
    setOpenActivityDialog(null);
  }

  function handleClose() {
    setOpenActivityDialog(null);
  }

  let dialogRef: HTMLDialogElement | undefined;
  let radioTabCenterRef: HTMLInputElement | undefined;
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

        <div class="tab-wrap">
          <input id="tab-join" type="radio" name="tab-switch" class="tab-switch" />
          <label class="tab-label" for="tab-join">
            はじまり
          </label>
          <div
            class="tab-content"
            classList={{
              "tab-content--disabled":
                formData.joinType === "notJoin" || formData.joinType === "oneJoin",
            }}
          >
            <div>
              <div>前の仕事が・・・</div>
              <div>
                <input
                  type="radio"
                  id="joinOne"
                  value="joinOne"
                  name="joinRadio"
                  disabled={formData.joinType === "notJoin" || formData.joinType === "oneJoin"}
                  checked={formData.joinType === "xorJoin"}
                  onChange={() => setFormData("joinType", "xorJoin")}
                />
                <label for="joinOne">ひとつでも終わったら</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="joinMany"
                  value="joinMany"
                  name="joinRadio"
                  disabled={formData.joinType === "notJoin" || formData.joinType === "oneJoin"}
                  checked={formData.joinType === "andJoin"}
                  onChange={() => setFormData("joinType", "andJoin")}
                />
                <label for="joinMany">すべて終わったら</label>
              </div>
              <div>この仕事を行う。</div>
            </div>
          </div>

          <input
            id="tab-work"
            type="radio"
            name="tab-switch"
            class="tab-switch"
            ref={radioTabCenterRef}
          />
          <label class="tab-label" for="tab-work">
            仕事
          </label>
          <div class="tab-content">
            <div class="dialog__activity-input">
              <div>ID</div>
              <input
                type="text"
                value={formData.xpdlId}
                onInput={handleXpdlIdInput}
                onChange={(e) => setFormData("xpdlId", e.target.value)}
              />

              <div>{t("jobTitle")}</div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData("name", e.target.value)}
              />

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

              <Switch>
                <Match when={formData.type === "autoActivity"}>
                  <div>処理内容 (OGNL)</div>
                  <div class="dialog__auto-activity-ognl-box">
                    <select>
                      <option>aaa</option>
                    </select>
                    <textarea />
                  </div>
                </Match>
                <Match
                  when={
                    formData.type === "manualTimerActivity" || formData.type === "autoTimerActivity"
                  }
                >
                  <div>自動で実行するのはいつ？ (OGNL)</div>
                  <div class="dialog__timer-activity-ognl-box">
                    <textarea />
                  </div>
                </Match>
              </Switch>
            </div>
          </div>

          <input id="tab-split" type="radio" name="tab-switch" class="tab-switch" />
          <label class="tab-label" for="tab-split">
            終わったら
          </label>
          <div
            class="tab-content"
            classList={{
              "tab-content--disabled":
                formData.splitType === "notSplit" || formData.splitType === "oneSplit",
            }}
          >
            <div>
              <div>後続の仕事への接続条件を満たす・・・</div>
              <div>
                <input
                  type="radio"
                  id="splitOne"
                  value="splitOne"
                  name="splitRadio"
                  disabled={formData.splitType === "notSplit" || formData.splitType === "oneSplit"}
                  checked={formData.splitType === "xorSplit"}
                  onChange={() => setFormData("splitType", "xorSplit")}
                />
                <label for="splitOne">どれかひとつ</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="splitMany"
                  value="splitMany"
                  name="splitRadio"
                  disabled={formData.splitType === "notSplit" || formData.splitType === "oneSplit"}
                  checked={formData.splitType === "andSplit"}
                  onChange={() => setFormData("splitType", "andSplit")}
                />
                <label for="splitMany">すべて</label>
              </div>
              <div>に続く</div>
            </div>
          </div>
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
