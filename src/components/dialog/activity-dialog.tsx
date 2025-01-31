import * as i18n from "@solid-primitives/i18n";
import { For, type JSXElement, Match, Show, Switch, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { ToggleIconButton } from "@/components/parts/toggle-icon-button";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { dataFactory, deepUnwrap, toActorId } from "@/data-source/data-factory";
import type { ActivityNode, ActorEntity, ApplicationEntity } from "@/data-source/data-type";
import { AutoActivityIcon } from "@/icons/auto-activity-icon";
import { AutoTimerActivityIcon } from "@/icons/auto-timer-activity-icon";
import { ManualActivityIcon } from "@/icons/manual-activity-icon";
import { ManualTimerActivityIcon } from "@/icons/manual-timer-activity-icon";
import { UserActivityIcon } from "@/icons/user-activity-icon";

export function ActivityDialog(): JSXElement {
  const { processModel, actorModel, activityNodeModel, dialogModel } = useModelContext();

  function handleFormSubmit(formData: ActivityNode) {
    const errorMessage = activityNodeModel.updateActivity(formData);
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
    if (dialogModel.openDialog()?.type === "activity") {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const activity = () => {
    const dialogData = dialogModel.openDialog();
    return dialogData?.type === "activity" ? dialogData.activity : undefined;
  };

  let dialogRef: HTMLDialogElement | undefined;
  return (
    <dialog ref={dialogRef} onClose={handleDialogClose}>
      <Show when={activity()} keyed={true}>
        {(activity) => (
          <ActivityDialogView
            activity={activity}
            applications={processModel.selectedProcess().detail.applications}
            actorList={actorModel.actorList}
            onFormSubmit={handleFormSubmit}
            onDialogClose={handleDialogClose}
          />
        )}
      </Show>
    </dialog>
  );
}

export function ActivityDialogView(props: {
  readonly activity: ActivityNode;
  readonly applications: ApplicationEntity[];
  readonly actorList: ActorEntity[];
  readonly onFormSubmit?: (formData: ActivityNode) => void;
  readonly onDialogClose?: () => void;
}) {
  const { dict } = useThemeContext();
  const t = i18n.translator(dict);

  const dummy = dataFactory.createActivityNode([], toActorId(0), "autoActivity", 0, 0);
  const [formData, setFormData] = createStore<ActivityNode>(dummy);
  const [selectedAppIndex, setSelectedAppIndex] = createSignal(-1);

  onMount(() => {
    const activity = deepUnwrap(props.activity);
    activity.applications = props.applications.map((app) => ({
      id: app.id,
      ognl: activity.applications.find((it) => it.id === app.id)?.ognl ?? "",
    }));
    setFormData(activity);
    setSelectedAppIndex(props.applications.length > 0 ? 0 : -1);

    if (radioTabCenterRef) {
      radioTabCenterRef.checked = true;
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    const activity: ActivityNode = deepUnwrap(formData);
    activity.applications =
      activity.activityType === "autoActivity" ? formData.applications.filter((it) => it.ognl !== "") : [];
    activity.ognl =
      formData.activityType === "manualTimerActivity" || formData.activityType === "autoTimerActivity"
        ? formData.ognl
        : "";

    props.onFormSubmit?.(activity);
  }

  let radioTabCenterRef: HTMLInputElement | undefined;
  return (
    <div class="w-[388px] bg-primary p-2">
      <h5 class="mb-2">{t("editActivity")}</h5>

      <form class="bg-background p-2" onSubmit={handleSubmit}>
        <div class="mb-2 flex flex-row">
          <ToggleIconButton
            id="manual-activity"
            title={t("manualActivity")}
            checked={formData.activityType === "manualActivity"}
            onChange={() => setFormData("activityType", "manualActivity")}
            margin="0 4px 0 0"
          >
            <ManualActivityIcon class="fill-foreground" />
          </ToggleIconButton>
          <ToggleIconButton
            id="auto-activity"
            title={t("autoActivity")}
            checked={formData.activityType === "autoActivity"}
            onChange={() => setFormData("activityType", "autoActivity")}
            margin="0 4px 0 0"
          >
            <AutoActivityIcon class="fill-foreground" />
          </ToggleIconButton>
          <ToggleIconButton
            id="manual-timer-activity"
            title={t("manualTimerActivity")}
            checked={formData.activityType === "manualTimerActivity"}
            onChange={() => setFormData("activityType", "manualTimerActivity")}
            margin="0 4px 0 0"
          >
            <ManualTimerActivityIcon class="fill-foreground" />
          </ToggleIconButton>
          <ToggleIconButton
            id="auto-timer-activity"
            title={t("autoTimerActivity")}
            checked={formData.activityType === "autoTimerActivity"}
            onChange={() => setFormData("activityType", "autoTimerActivity")}
            margin="0 4px 0 0"
          >
            <AutoTimerActivityIcon class="fill-foreground" />
          </ToggleIconButton>
          <ToggleIconButton
            id="user-activity"
            title={t("handWork")}
            checked={formData.activityType === "userActivity"}
            onChange={() => setFormData("activityType", "userActivity")}
          >
            <UserActivityIcon class="fill-foreground" />
          </ToggleIconButton>
        </div>

        <div class="mb-2 flex flex-wrap">
          <input
            id="tab-join"
            data-testId="tab-join"
            type="radio"
            name="tab-switch"
            class="peer/tab-switch1 -m-px absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
          />
          <label
            class="-order-1 mr-1 cursor-pointer bg-secondary px-2 py-1 hover:bg-primary peer-checked/tab-switch1:bg-primary"
            for="tab-join"
          >
            {t("beginning")}
          </label>
          <div
            class="hidden h-[300px] w-full border border-secondary border-solid py-4 pl-2 peer-checked/tab-switch1:block"
            classList={{
              "opacity-50": formData.joinType === "notJoin" || formData.joinType === "oneJoin",
            }}
          >
            <div>
              <div>{t("previousWork")}</div>
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
                <label for="joinOne">{t("whenOneDone")}</label>
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
                <label for="joinMany">{t("whenAllOver")}</label>
              </div>
              <div>{t("executeJob")}</div>
            </div>
          </div>

          <input
            id="tab-work"
            type="radio"
            name="tab-switch"
            class="peer/tab-switch2 -m-px absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
            ref={radioTabCenterRef}
          />
          <label
            class="-order-1 mr-1 cursor-pointer bg-secondary px-2 py-1 hover:bg-primary peer-checked/tab-switch2:bg-primary"
            for="tab-work"
          >
            {t("work")}
          </label>
          <div class="hidden h-[300px] w-full border border-secondary border-solid py-4 pl-2 peer-checked/tab-switch2:block">
            <div class="grid grid-cols-[64px_266px] gap-2">
              <div>ID</div>
              <input type="text" value={formData.xpdlId} onChange={(e) => setFormData("xpdlId", e.target.value)} />

              <div>{t("jobTitle")}</div>
              <input type="text" value={formData.name} onChange={(e) => setFormData("name", e.target.value)} />

              <div>{t("actor")}</div>
              <select onChange={(e) => setFormData("actorId", Number(e.target.value))}>
                <For each={props.actorList}>
                  {(actor) => (
                    <option value={actor.id} selected={actor.id === formData.actorId}>
                      {actor.name}
                    </option>
                  )}
                </For>
              </select>

              <Switch>
                <Match when={formData.activityType === "autoActivity"}>
                  <div>{t("processingDetails")}</div>
                  <div class="flex h-[160px] flex-col border-gray-300 border-solid">
                    <select
                      disabled={selectedAppIndex() < 0}
                      value={selectedAppIndex()}
                      onChange={(e) => {
                        setSelectedAppIndex(Number(e.target.value));
                      }}
                    >
                      <For each={props.applications}>
                        {(app, index) => <option value={index()}>{`${app.name} (${app.xpdlId})`}</option>}
                      </For>
                    </select>
                    <textarea
                      class="mt-2 h-full resize-none"
                      disabled={selectedAppIndex() < 0}
                      value={formData.applications[selectedAppIndex()]?.ognl ?? t("registerProcessApp")}
                      onChange={(e) => setFormData("applications", [selectedAppIndex()], "ognl", e.target.value)}
                    />
                  </div>
                </Match>
                <Match
                  when={
                    formData.activityType === "manualTimerActivity" || formData.activityType === "autoTimerActivity"
                  }
                >
                  <div>{t("whenRunAutomatically")}</div>
                  <div class="h-[160px] w-[266px]">
                    <textarea
                      class="size-full resize-none border-0"
                      value={formData.ognl}
                      onChange={(e) => setFormData("ognl", e.target.value)}
                    />
                  </div>
                </Match>
              </Switch>
            </div>
          </div>

          <input
            id="tab-split"
            data-testId="tab-split"
            type="radio"
            name="tab-switch"
            class="peer/tab-switch3 -m-px absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
          />
          <label
            class="-order-1 mr-1 cursor-pointer bg-secondary px-2 py-1 hover:bg-primary peer-checked/tab-switch3:bg-primary"
            for="tab-split"
          >
            {t("termination")}
          </label>
          <div
            class="hidden h-[300px] w-full border border-secondary border-solid py-4 pl-2 peer-checked/tab-switch3:block"
            classList={{
              "opacity-50": formData.splitType === "notSplit" || formData.splitType === "oneSplit",
            }}
          >
            <div>
              <div>{t("nextJobCondition")}</div>
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
                <label for="splitOne">{t("oneOfThese")}</label>
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
                <label for="splitMany">{t("all")}</label>
              </div>
              <div>{t("processContinues")}</div>
            </div>
          </div>
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
