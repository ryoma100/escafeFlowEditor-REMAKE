import { For, JSXElement, Match, Switch, createEffect, createSignal } from "solid-js";

import { ButtonsContainer } from "@/components/parts/buttons-container";
import { ToggleIconButton } from "@/components/parts/toggle-icon-button";
import { I18nDict } from "@/constants/i18n";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { ModalDialogType } from "@/data-model/dialog-model";
import { dataFactory, deepUnwrap } from "@/data-source/data-factory";
import { ActivityNode, ActorEntity, ApplicationEntity } from "@/data-source/data-type";
import { AutoActivityIcon } from "@/icons/auto-activity-icon";
import { AutoTimerActivityIcon } from "@/icons/auto-timer-activity-icon";
import { ManualActivityIcon } from "@/icons/manual-activity-icon";
import { ManualTimerActivityIcon } from "@/icons/manual-timer-activity-icon";
import { UserActivityIcon } from "@/icons/user-activity-icon";
import { createStore } from "solid-js/store";

const dummy = dataFactory.createActivityNode([], 0, "autoActivity", 0, 0);

export function ActivityDialog(): JSXElement {
  const { dict } = useThemeContext();
  const {
    processModel: { selectedProcess },
    actorModel: { actorList },
    activityNodeModel: { updateActivity },
    dialogModel: {
      modalDialog: openDialog,
      setModalDialog: setOpenDialog,
      setMessageAlert: setOpenMessageDialog,
    },
  } = useModelContext();

  function handleFormSubmit(formData: ActivityNode) {
    const errorMessage = updateActivity(formData);
    if (errorMessage) {
      setOpenMessageDialog(errorMessage);
      return;
    }
    setOpenDialog(null);
  }

  function handleDialogClose() {
    setOpenDialog(null);
  }

  return (
    <ActivityDialogView
      openDialog={openDialog()}
      applications={selectedProcess().detail.applications}
      actorList={actorList}
      dict={dict()}
      onFormSubmit={handleFormSubmit}
      onDialogClose={handleDialogClose}
    />
  );
}

export function ActivityDialogView(props: {
  openDialog: ModalDialogType | null;
  applications: ApplicationEntity[];
  actorList: ActorEntity[];
  dict: I18nDict;
  onFormSubmit?: (formData: ActivityNode) => void;
  onDialogClose?: () => void;
}) {
  const [formData, setFormData] = createStore<ActivityNode>(dummy);
  const [selectedAppIndex, setSelectedAppIndex] = createSignal(-1);

  createEffect(() => {
    if (props.openDialog?.type === "activity") {
      const activity = deepUnwrap(props.openDialog.activity);
      activity.applications = props.applications.map((app) => ({
        id: app.id,
        ognl: activity.applications.find((it) => it.id === app.id)?.ognl ?? "",
      }));
      setFormData(activity);
      setSelectedAppIndex(props.applications.length > 0 ? 0 : -1);
      dialogRef?.showModal();
      if (radioTabCenterRef) {
        radioTabCenterRef.checked = true;
      }
    } else {
      dialogRef?.close();
    }
  });

  function handleSubmit(e: Event) {
    e.preventDefault();

    const activity: ActivityNode = deepUnwrap(formData);
    activity.applications =
      activity.activityType === "autoActivity"
        ? formData.applications.filter((it) => it.ognl !== "")
        : [];
    activity.ognl =
      formData.activityType === "manualTimerActivity" ||
      formData.activityType === "autoTimerActivity"
        ? formData.ognl
        : "";

    props.onFormSubmit?.(activity);
  }

  let dialogRef: HTMLDialogElement | undefined;
  let radioTabCenterRef: HTMLInputElement | undefined;
  return (
    <dialog
      class="w-[388px] bg-primary2 p-2"
      ref={dialogRef}
      onClose={() => props.onDialogClose?.()}
    >
      <h5 class="mb-2">{props.dict.editActivity}</h5>

      <form class="bg-white p-2" onSubmit={handleSubmit}>
        <div class="mb-2 flex flex-row">
          <ToggleIconButton
            id="manual-activity"
            title={props.dict.manualActivity}
            checked={formData.activityType === "manualActivity"}
            onChange={() => setFormData("activityType", "manualActivity")}
            margin="0 4px 0 0"
          >
            <ManualActivityIcon />
          </ToggleIconButton>
          <ToggleIconButton
            id="auto-activity"
            title={props.dict.autoActivity}
            checked={formData.activityType === "autoActivity"}
            onChange={() => setFormData("activityType", "autoActivity")}
            margin="0 4px 0 0"
          >
            <AutoActivityIcon />
          </ToggleIconButton>
          <ToggleIconButton
            id="manual-timer-activity"
            title={props.dict.manualTimerActivity}
            checked={formData.activityType === "manualTimerActivity"}
            onChange={() => setFormData("activityType", "manualTimerActivity")}
            margin="0 4px 0 0"
          >
            <ManualTimerActivityIcon />
          </ToggleIconButton>
          <ToggleIconButton
            id="auto-timer-activity"
            title={props.dict.autoTimerActivity}
            checked={formData.activityType === "autoTimerActivity"}
            onChange={() => setFormData("activityType", "autoTimerActivity")}
            margin="0 4px 0 0"
          >
            <AutoTimerActivityIcon />
          </ToggleIconButton>
          <ToggleIconButton
            id="user-activity"
            title={props.dict.handWork}
            checked={formData.activityType === "userActivity"}
            onChange={() => setFormData("activityType", "userActivity")}
          >
            <UserActivityIcon />
          </ToggleIconButton>
        </div>

        <div class="mb-2 flex flex-wrap">
          <input
            id="tab-join"
            type="radio"
            name="tab-switch"
            class="
              peer/tab-switch1
              b-0 absolute m-[-1px] h-[1px]
              w-[1px] overflow-hidden whitespace-nowrap p-0
              [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
          />
          <label
            class="
              -order-1 mr-1 bg-gray-300 px-2 py-1
              peer-checked/tab-switch1:bg-primary1"
            for="tab-join"
          >
            {props.dict.beginning}
          </label>
          <div
            class="
              hidden h-[300px] w-full border border-solid border-gray-300 py-4 pl-2
              peer-checked/tab-switch1:block"
            classList={{
              "bg-gray-100": formData.joinType === "notJoin" || formData.joinType === "oneJoin",
            }}
          >
            <div>
              <div>{props.dict.previousWork}</div>
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
                <label for="joinOne">{props.dict.whenOneDone}</label>
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
                <label for="joinMany">{props.dict.whenAllOver}</label>
              </div>
              <div>{props.dict.executeJob}</div>
            </div>
          </div>

          <input
            id="tab-work"
            type="radio"
            name="tab-switch"
            class="
              peer/tab-switch2
              b-0 absolute m-[-1px] h-[1px]
              w-[1px] overflow-hidden whitespace-nowrap p-0
              [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
            ref={radioTabCenterRef}
          />
          <label
            class="
              -order-1 mr-1 bg-gray-300 px-2 py-1
              peer-checked/tab-switch2:bg-primary1"
            for="tab-work"
          >
            {props.dict.work}
          </label>
          <div
            class="
              hidden h-[300px] w-full border border-solid border-gray-300 py-4 pl-2
              peer-checked/tab-switch2:block"
          >
            <div class="grid grid-cols-[64px_266px] gap-2">
              <div>ID</div>
              <input
                type="text"
                value={formData.xpdlId}
                onChange={(e) => setFormData("xpdlId", e.target.value)}
              />

              <div>{props.dict.jobTitle}</div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData("name", e.target.value)}
              />

              <div>{props.dict.actor}</div>
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
                  <div>{props.dict.processingDetails}</div>
                  <div class="flex h-[160px] flex-col border-solid border-gray-300">
                    <select
                      disabled={selectedAppIndex() < 0}
                      value={selectedAppIndex()}
                      onChange={(e) => {
                        setSelectedAppIndex(Number(e.target.value));
                      }}
                    >
                      <For each={props.applications}>
                        {(app, index) => (
                          <option value={index()}>{`${app.name} (${app.xpdlId})`}</option>
                        )}
                      </For>
                    </select>
                    <textarea
                      class="mt-2 h-full resize-none"
                      disabled={selectedAppIndex() < 0}
                      value={
                        formData.applications[selectedAppIndex()]?.ognl ??
                        props.dict.registerProcessApp
                      }
                      onChange={(e) =>
                        setFormData("applications", [selectedAppIndex()], "ognl", e.target.value)
                      }
                    />
                  </div>
                </Match>
                <Match
                  when={
                    formData.activityType === "manualTimerActivity" ||
                    formData.activityType === "autoTimerActivity"
                  }
                >
                  <div>{props.dict.whenRunAutomatically}</div>
                  <div class="h-[160px] w-[266px]">
                    <textarea
                      class="b-0 h-full w-full resize-none"
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
            type="radio"
            name="tab-switch"
            class="
              peer/tab-switch3
              b-0 absolute m-[-1px] h-[1px]
              w-[1px] overflow-hidden whitespace-nowrap p-0
              [clip-path:inset(50%)] [clip:rect(0_0_0_0)]"
          />
          <label
            class="
              -order-1 mr-1 bg-gray-300 px-2 py-1
              peer-checked/tab-switch3:bg-primary1"
            for="tab-split"
          >
            {props.dict.termination}
          </label>
          <div
            class="
              hidden h-[300px] w-full border border-solid border-gray-300 py-4 pl-2
              peer-checked/tab-switch3:block"
            classList={{
              "bg-gray-100": formData.splitType === "notSplit" || formData.splitType === "oneSplit",
            }}
          >
            <div>
              <div>{props.dict.nextJobCondition}</div>
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
                <label for="splitOne">{props.dict.oneOfThese}</label>
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
                <label for="splitMany">{props.dict.all}</label>
              </div>
              <div>{props.dict.processContinues}</div>
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
    </dialog>
  );
}
