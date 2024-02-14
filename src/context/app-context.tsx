import * as i18n from "@solid-primitives/i18n";
import { JSX, createContext, createMemo, createSignal, useContext } from "solid-js";
import { DragType } from "../components/diagram/disgram";
import { ToolbarType } from "../components/toolbar/toolbar";
import { enDict } from "../constants/i18n-en";
import { jaDict } from "../constants/i18n-ja";
import { makeActivityModel } from "../data-model/activity-model";
import { makeActorModel } from "../data-model/actor-model";
import { makeCommentModel } from "../data-model/comment-model";
import { makeProcessModel } from "../data-model/process-model";
import { makeProjectModel } from "../data-model/project-model";
import { makeTransitionModel } from "../data-model/transition-model";
import {
  ActivityNodeEntity,
  ActorEntity,
  CommentNodeEntity,
  ProcessEntity,
  ProjectEntity,
  TransitionEdgeEntity,
} from "../data-source/data-type";

function makeModelContext() {
  const actorModel = makeActorModel();
  const activityModel = makeActivityModel(actorModel);
  const transitionModel = makeTransitionModel(activityModel);
  const commentModel = makeCommentModel();
  const processModel = makeProcessModel(actorModel, activityModel, transitionModel, commentModel);
  const projectModel = makeProjectModel(processModel);

  return {
    projectModel,
    processModel,
    actorModel,
    activityModel,
    transitionModel,
    commentModel,
  };
}

function makeDialogContext() {
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

function makeDiagramContext() {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [zoom, setZoom] = createSignal<number>(1.0);
  const [dragType, setDragType] = createSignal<DragType>("none");
  const [addingLine, setAddingLine] = createSignal<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }>(undefined as never);

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

function makei18nContext() {
  const dictionaries = { ja: jaDict, en: enDict };
  const [locale, setLocale] = createSignal<keyof typeof dictionaries>("ja");
  const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));
  return { dict, setLocale };
}

const AppContext = createContext<{
  projectModel: ReturnType<typeof makeProjectModel>;
  processModel: ReturnType<typeof makeProcessModel>;
  actorModel: ReturnType<typeof makeActorModel>;
  activityModel: ReturnType<typeof makeActivityModel>;
  transitionModel: ReturnType<typeof makeTransitionModel>;
  commentModel: ReturnType<typeof makeCommentModel>;
  dialog: ReturnType<typeof makeDialogContext>;
  diagram: ReturnType<typeof makeDiagramContext>;
  i18n: ReturnType<typeof makei18nContext>;
}>({
  projectModel: undefined as never,
  processModel: undefined as never,
  actorModel: undefined as never,
  activityModel: undefined as never,
  transitionModel: undefined as never,
  commentModel: undefined as never,
  dialog: undefined as never,
  diagram: undefined as never,
  i18n: undefined as never,
});

export function AppProvider(props: { children: JSX.Element }) {
  const value = {
    ...makeModelContext(),
    dialog: makeDialogContext(),
    diagram: makeDiagramContext(),
    i18n: makei18nContext(),
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
