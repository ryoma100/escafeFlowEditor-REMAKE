import { TauriEvent } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import * as dialog from "@tauri-apps/plugin-dialog";
import { exit } from "@tauri-apps/plugin-process";
import { JSXElement, Show } from "solid-js";

import { AboutDialog } from "@/components/dialog/about-dialog";
import { ActivityDialog } from "@/components/dialog/activity-dialog";
import { ActorDialog } from "@/components/dialog/actor-dialog";
import { CommentDialog } from "@/components/dialog/comment-dialog";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { LoadDialog } from "@/components/dialog/load-dialog";
import { MessageDialog } from "@/components/dialog/message-dialog";
import { ProcessDialog } from "@/components/dialog/process-dialog";
import { ProjectDialog } from "@/components/dialog/project-dialog";
import { SaveDialog } from "@/components/dialog/save-dialog";
import { SettingDialog } from "@/components/dialog/setting-dialog";
import { TransitionDialog } from "@/components/dialog/transition-dialog";
import { ActorList } from "@/components/list/actor-list";
import { ProcessList } from "@/components/list/process-list";
import { Main } from "@/components/main/main";
import { AppMenu } from "@/components/menu/menu";
import { Toolbar } from "@/components/toolbar/toolbar";
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";

function App(): JSXElement {
  const {
    projectModel: { initProject },
  } = useModelContext();
  initProject();

  return (
    <>
      <AppView />

      <ProjectDialog />
      <ProcessDialog />
      <ActorDialog />
      <ActivityDialog />
      <TransitionDialog />
      <CommentDialog />
      <LoadDialog />
      <SaveDialog />
      <SettingDialog />
      <MessageDialog />
      <AboutDialog />
      <ConfirmDialog />

      <Show when={import.meta.env.PROD}>
        <WindowUnloadDialog />
      </Show>
    </>
  );
}

export function AppView() {
  return (
    <div class="grid size-full select-none grid-cols-[160px_84px_auto] grid-rows-[24px_35fr_65fr] bg-secondary">
      <div class="col-start-1 col-end-5 row-start-1">
        <AppMenu />
      </div>
      <div class="col-start-1 row-start-2 ml-2 h-[calc(100%_-_4px)] w-[calc(100%_-_8px)]">
        <ProcessList />
      </div>
      <div class="col-start-1 row-start-3 ml-2 h-[calc(100%_-_4px)] w-[calc(100%_-_8px)]">
        <ActorList />
      </div>
      <div class="col-start-2 row-start-2 row-end-4 mt-5">
        <Toolbar />
      </div>
      <div class="col-start-3 col-end-5 row-start-2 row-end-4 h-[calc(100%_-_4px)] w-[calc(100%_-_8px)]">
        <Main />
      </div>
    </div>
  );
}

function WindowUnloadDialog() {
  const { dict } = useThemeContext();

  window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
  });

  if ("__TAURI_IPC__" in window) {
    const appWindow = getCurrentWebviewWindow();
    appWindow.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
      const confirmed = await dialog.confirm(dict().exit);
      if (confirmed) {
        exit(0);
      }
    });
  }

  return <></>;
}

export default App;
