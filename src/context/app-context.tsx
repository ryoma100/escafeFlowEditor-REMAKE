import * as i18n from "@solid-primitives/i18n";
import { JSX, createContext, createMemo, createSignal, useContext } from "solid-js";
import { DragType } from "../components/diagram/diagram";
import { ToolbarType } from "../components/toolbar/toolbar";
import { enDict } from "../constants/i18n-en";
import { jaDict } from "../constants/i18n-ja";
import { makeActivityModel } from "../data-model/activity-model";
import { makeActorModel } from "../data-model/actor-model";
import { makeBaseEdgeModel } from "../data-model/base-edge-model";
import { makeBaseNodeModel } from "../data-model/base-node-model";
import { makeOtherEdgeModel } from "../data-model/other-edge-model";
import { makeOtherNodeModel } from "../data-model/other-node-model";
import { makeProcessModel } from "../data-model/process-model";
import { makeProjectModel } from "../data-model/project-model";
import { makeTransitionModel } from "../data-model/transition-model";
import {
  ActivityNode,
  ActorEntity,
  CommentNode,
  ProcessEntity,
  ProjectEntity,
  TransitionEdge,
} from "../data-source/data-type";

function makeModelContext() {
  const activityModel = makeActivityModel();
  const actorModel = makeActorModel(activityModel);
  const otherNodeModel = makeOtherNodeModel();
  const transitionModel = makeTransitionModel(activityModel);
  const otherEdgeModel = makeOtherEdgeModel(otherNodeModel, activityModel);
  const baseEdgeModel = makeBaseEdgeModel(transitionModel, otherEdgeModel);
  const baseNodeModel = makeBaseNodeModel(
    activityModel,
    otherNodeModel,
    transitionModel,
    otherEdgeModel,
  );
  const processModel = makeProcessModel(
    actorModel,
    activityModel,
    transitionModel,
    otherNodeModel,
    otherEdgeModel,
  );
  const projectModel = makeProjectModel(processModel);

  return {
    projectModel,
    processModel,
    actorModel,
    activityModel,
    transitionModel,
    otherNodeModel,
    otherEdgeModel,
    baseNodeModel,
    baseEdgeModel,
  };
}

function makeDialogContext() {
  const [openProjectDialog, setOpenProjectDialog] = createSignal<ProjectEntity | null>(null);
  const [openProcessDialog, setOpenProcessDialog] = createSignal<ProcessEntity | null>(null);
  const [openActorDialog, setOpenActorDialog] = createSignal<ActorEntity | null>(null);
  const [openActivityDialog, setOpenActivityDialog] = createSignal<ActivityNode | null>(null);
  const [openTransitionDialog, setOpenTransitionDialog] = createSignal<TransitionEdge | null>(null);
  const [openCommentDialog, setOpenCommentDialog] = createSignal<CommentNode | null>(null);
  const [openSaveDialog, setOpenSaveDialog] = createSignal<ProjectEntity | null>(null);
  const [openMessageDialog, setOpenMessageDialog] = createSignal<keyof typeof enDict | null>(null);
  const [openAboutDialog, setOpenAboutDialog] = createSignal<boolean>(false);

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
    openSaveDialog,
    setOpenSaveDialog,
    openMessageDialog,
    setOpenMessageDialog,
    openAboutDialog,
    setOpenAboutDialog,
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

  function setAddingLineFrom(x: number, y: number) {
    setAddingLine({ fromX: x, fromY: y, toX: x, toY: y });
  }

  function setAddingLineTo(x: number, y: number) {
    setAddingLine({ fromX: addingLine().fromX, fromY: addingLine().fromY, toX: x, toY: y });
  }

  return {
    toolbar,
    setToolbar,
    zoom,
    setZoom,
    dragType,
    setDragType,
    addingLine,
    setAddingLineFrom,
    setAddingLineTo,
  };
}

function makeI18nContext() {
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
  otherNodeModel: ReturnType<typeof makeOtherNodeModel>;
  baseNodeModel: ReturnType<typeof makeBaseNodeModel>;
  transitionModel: ReturnType<typeof makeTransitionModel>;
  otherEdgeModel: ReturnType<typeof makeOtherEdgeModel>;
  baseEdgeModel: ReturnType<typeof makeBaseEdgeModel>;
  dialog: ReturnType<typeof makeDialogContext>;
  diagram: ReturnType<typeof makeDiagramContext>;
  i18n: ReturnType<typeof makeI18nContext>;
}>({
  projectModel: undefined as never,
  processModel: undefined as never,
  actorModel: undefined as never,
  activityModel: undefined as never,
  otherNodeModel: undefined as never,
  baseNodeModel: undefined as never,
  transitionModel: undefined as never,
  otherEdgeModel: undefined as never,
  baseEdgeModel: undefined as never,
  dialog: undefined as never,
  diagram: undefined as never,
  i18n: undefined as never,
});

export function AppProvider(props: { children: JSX.Element }) {
  const value = {
    ...makeModelContext(),
    dialog: makeDialogContext(),
    diagram: makeDiagramContext(),
    i18n: makeI18nContext(),
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
