import { ActorList } from "./components/list/actor-list";
import { Menu } from "./components/menu/menu";
import { ProcessList } from "./components/list/process-list";
import { Toolbar } from "./components/toolbar/toolbar";
import "./app.css";
import { ProcessDialog } from "./components/dialog/process-dialog";
import { Main } from "./components/main/main";
import { ActorDialog } from "./components/dialog/actor-dialog";
import { ActivityDialog } from "./components/dialog/activity-dialog";
import { TransitionDialog } from "./components/dialog/transition-dialog";
import { JSXElement } from "solid-js";
import { CommentDialog } from "./components/dialog/comment-dialog";
import { ProjectDialog } from "./components/dialog/project-dialog";

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
    </>
  );
}

export default App;
