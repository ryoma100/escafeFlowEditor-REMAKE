import { JSX, createContext, createSignal, useContext } from "solid-js";
import { DragType } from "../components/diagram/disgram";
import { ToolbarType } from "../components/toolbar/toolbar";
import { createActivityModel } from "../data-model/activity-model";
import { createActorModel } from "../data-model/actor-model";
import { createCommentModel } from "../data-model/comment-model";
import { createProcessModel } from "../data-model/process-model";
import { createProjectModel } from "../data-model/project-model";
import { createTransitionModel } from "../data-model/transition-model";
import {
  ActivityNodeEntity,
  ActorEntity,
  CommentNodeEntity,
  ProcessEntity,
  ProjectEntity,
  TransitionEdgeEntity,
} from "../data-source/data-type";

const AppContext = createContext<{
  projectModel: ReturnType<typeof createProjectModel>;
  processModel: ReturnType<typeof createProcessModel>;
  actorModel: ReturnType<typeof createActorModel>;
  activityModel: ReturnType<typeof createActivityModel>;
  transitionModel: ReturnType<typeof createTransitionModel>;
  commentModel: ReturnType<typeof createCommentModel>;
  dialog: ReturnType<typeof createDialogContext>;
  diagram: ReturnType<typeof createDiagramContext>;
}>({
  projectModel: undefined as any,
  processModel: undefined as any,
  actorModel: undefined as any,
  activityModel: undefined as any,
  transitionModel: undefined as any,
  commentModel: undefined as any,
  dialog: undefined as any,
  diagram: undefined as any,
});

function createModelContext() {
  const projectModel = createProjectModel();
  const actorModel = createActorModel();
  const activityModel = createActivityModel(actorModel);
  const transitionModel = createTransitionModel(activityModel);
  const commentModel = createCommentModel();
  const processModel = createProcessModel(actorModel, activityModel, transitionModel, commentModel);

  return {
    projectModel,
    processModel,
    actorModel,
    activityModel,
    transitionModel,
    commentModel,
  };
}

function createDialogContext() {
  const [openProjectDialog, setOpenProjectDialog] = createSignal<ProjectEntity | null>(null);
  const [openProcessDialog, setOpenProcessDialog] = createSignal<ProcessEntity | null>(null);
  const [openActorDialog, setOpenActorDialog] = createSignal<ActorEntity | null>(null);
  const [openActivityDialog, setOpenActivityDialog] = createSignal<ActivityNodeEntity | null>(null);
  const [openTransitionDialog, setOpenTransitionDialog] = createSignal<TransitionEdgeEntity | null>(
    null,
  );
  const [openCommentDialog, setOpenCommentDialog] = createSignal<CommentNodeEntity | null>(null);

  return {
    openProjectDialog,
    setOpenProjectDialog,
    openProcessDialog,
    setOpenProcessDialog,
    openActorDialog,
    setOpenActorDialog,
    openActivityDialog,
    setOpenActivityDialog,
    openTransitionDialog,
    setOpenTransitionDialog,
    openCommentDialog,
    setOpenCommentDialog,
  };
}

function createDiagramContext() {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [zoom, setZoom] = createSignal<number>(1.0);
  const [dragType, setDragType] = createSignal<DragType>("none");
  const [addingLine, setAddingLine] = createSignal<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }>(null as any);

  return {
    toolbar,
    setToolbar,
    zoom,
    setZoom,
    dragType,
    setDragType,
    addingLine,
    setAddingLine,
  };
}

export function AppProvider(props: { children: JSX.Element }) {
  const value = {
    ...createModelContext(),
    dialog: createDialogContext(),
    diagram: createDiagramContext(),
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
