import { type JSXElement, Show } from "solid-js";

import { TauriEvent } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import * as dialog from "@tauri-apps/plugin-dialog";
import { exit } from "@tauri-apps/plugin-process";

import Resizable from "@corvu/resizable";

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
import { useModelContext } from "@/context/model-context";
import { useThemeContext } from "@/context/theme-context";
import { Toolbar } from "./components/toolbar/toolbar";

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
    <div class="grid size-full select-none grid-rows-[auto_1fr] bg-secondary">
      <AppMenu />
      <main>
        <Resizable class="size-full px-2">
          <Resizable.Panel initialSize={0.2}>
            <Resizable orientation="vertical" class="size-full pb-1">
              <Resizable.Panel initialSize={0.5}>
                <ProcessList />
              </Resizable.Panel>
              <Resizable.Handle aria-label="Resize Handle">
                <div class="h-2 w-full hover:bg-primary" />
              </Resizable.Handle>
              <Resizable.Panel>
                <ActorList />
              </Resizable.Panel>
            </Resizable>
          </Resizable.Panel>
          <Resizable.Handle aria-label="Resize Handle">
            <div class="h-full w-2 hover:bg-primary" />
          </Resizable.Handle>
          <Resizable.Panel initialSize={0.8} class="flex pb-1">
            <Toolbar />
            <Main />
          </Resizable.Panel>
        </Resizable>
      </main>
    </div>
  );
}

function WindowUnloadDialog() {
  const { dict } = useThemeContext();

  window.addEventListener("beforeunload", (e) => {
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
