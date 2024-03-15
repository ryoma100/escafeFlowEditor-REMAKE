import * as i18n from "@solid-primitives/i18n";
import { JSX, createContext, createMemo, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { DragType } from "../components/diagram/diagram";
import { ToolbarType } from "../components/toolbar/toolbar";
import { defaultRectangle } from "../constants/app-const";
import { enDict } from "../constants/i18n-en";
import { jaDict } from "../constants/i18n-ja";
import { makeActivityModel } from "../data-model/activity-node-model";
import { makeActorModel } from "../data-model/actor-model";
import { makeBaseEdgeModel } from "../data-model/base-edge-model";
import { makeBaseNodeModel } from "../data-model/base-node-model";
import { makeExtendNodeModel } from "../data-model/extend-node-model";
import { makeProcessModel } from "../data-model/process-model";
import { makeProjectModel } from "../data-model/project-model";
import {
  ActivityNode,
  ActorEntity,
  CommentNode,
  ProcessEntity,
  ProjectEntity,
  Rectangle,
  TransitionEdge,
} from "../data-source/data-type";

function makeModelContext() {
  const baseNodeModel = makeBaseNodeModel();
  const activityNodeModel = makeActivityModel(baseNodeModel);
  const baseEdgeModel = makeBaseEdgeModel(baseNodeModel, activityNodeModel);
  const extendNodeModel = makeExtendNodeModel(baseNodeModel);
  const actorModel = makeActorModel();
  const processModel = makeProcessModel(actorModel, baseNodeModel, baseEdgeModel);
  const projectModel = makeProjectModel(processModel);

  return {
    projectModel,
    processModel,
    actorModel,
    activityNodeModel,
    extendNodeModel,
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
  const [openConfirmDialog, setOpenConfirmDialog] = createSignal<
    "initAll" | "deleteProcess" | null
  >(null);

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
    openConfirmDialog,
    setOpenConfirmDialog,
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
  const [svgRect, setSvgRect] = createStore({ ...defaultRectangle });
  const [viewBox, setViewBox] = createStore({ ...defaultRectangle });

  function setAddingLineFrom(x: number, y: number) {
    setAddingLine({ fromX: x, fromY: y, toX: x, toY: y });
  }

  function setAddingLineTo(x: number, y: number) {
    setAddingLine({ fromX: addingLine().fromX, fromY: addingLine().fromY, toX: x, toY: y });
  }

  function autoRectangle(rect: Rectangle) {
    setZoom(Math.min(svgRect.width / rect.width, svgRect.height / rect.height));
    setViewBox({ x: rect.x, y: rect.y, width: viewBox.width, height: viewBox.height });
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
    svgRect,
    setSvgRect,
    autoRectangle,
    viewBox,
    setViewBox,
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
  activityNodeModel: ReturnType<typeof makeActivityModel>;
  extendNodeModel: ReturnType<typeof makeExtendNodeModel>;
  baseNodeModel: ReturnType<typeof makeBaseNodeModel>;
  baseEdgeModel: ReturnType<typeof makeBaseEdgeModel>;
  dialog: ReturnType<typeof makeDialogContext>;
  diagram: ReturnType<typeof makeDiagramContext>;
  i18n: ReturnType<typeof makeI18nContext>;
}>({
  projectModel: undefined as never,
  processModel: undefined as never,
  actorModel: undefined as never,
  activityNodeModel: undefined as never,
  extendNodeModel: undefined as never,
  baseNodeModel: undefined as never,
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
