import { JSXElement } from "solid-js";

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

function App(): JSXElement {
  const {
    projectModel: { initProject },
  } = useModelContext();
  initProject();

  return (
    <>
      <div class="grid h-full w-full select-none grid-cols-[160px_84px_auto] grid-rows-[24px_35fr_65fr]">
        <div class="col-start-1 col-end-5 row-start-1">
          <AppMenu />
        </div>
        <div class="col-start-1 row-start-2 ml-2 h-[calc(35vh_-_20px)]">
          <ProcessList />
        </div>
        <div class="col-start-1 row-start-3 ml-2 h-[calc(65vh_-_20px)]">
          <ActorList />
        </div>
        <div class="col-start-2 row-start-2 row-end-4 mt-4">
          <Toolbar />
        </div>
        <div class="col-start-3 row-start-2 row-end-4 h-[calc(100vh_-_28px)] w-[calc(100vw_-_254px)]">
          <Main />
        </div>
      </div>

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
    </>
  );
}

export default App;
