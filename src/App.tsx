import { JSXElement } from "solid-js";
import "./App.css";
import { AboutDialog } from "./components/dialog/about-dialog";
import { ActivityDialog } from "./components/dialog/activity-dialog";
import { ActorDialog } from "./components/dialog/actor-dialog";
import { CommentDialog } from "./components/dialog/comment-dialog";
import { InitDialog } from "./components/dialog/init-dialog";
import { MessageDialog } from "./components/dialog/message-dialog";
import { ProcessDialog } from "./components/dialog/process-dialog";
import { ProjectDialog } from "./components/dialog/project-dialog";
import { SaveDialog } from "./components/dialog/save-dialog";
import { TransitionDialog } from "./components/dialog/transition-dialog";
import { ActorList } from "./components/list/actor-list";
import { ProcessList } from "./components/list/process-list";
import { Main } from "./components/main/main";
import { Menu } from "./components/menu/menu";
import { Toolbar } from "./components/toolbar/toolbar";

function App(): JSXElement {
  return (
    <>
      <div class="app">
        <div class="app__menu">
          <Menu />
        </div>
        <div class="app__process-list">
          <ProcessList />
        </div>
        <div class="app__actor-list">
          <ActorList />
        </div>
        <div class="app__toolbar">
          <Toolbar />
        </div>
        <div class="app__main">
          <Main />
        </div>
      </div>

      <ProjectDialog />
      <ProcessDialog />
      <ActorDialog />
      <ActivityDialog />
      <TransitionDialog />
      <CommentDialog />
      <SaveDialog />
      <MessageDialog />
      <AboutDialog />
      <InitDialog />
    </>
  );
}

export default App;
