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
import { makeEdgeModel } from "../data-model/edge-model";
import { makeExtendEdgeModel } from "../data-model/extend-edge-model";
import { makeExtendNodeModel } from "../data-model/extend-node-model";
import { makeNodeModel } from "../data-model/node-model";
import { makeProcessModel } from "../data-model/process-model";
import { makeProjectModel } from "../data-model/project-model";
import { makeTransactionEdgeModel } from "../data-model/transaction-edge-model";
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
  const actorModel = makeActorModel();
  const nodeModel = makeNodeModel();
  const edgeModel = makeEdgeModel(nodeModel);
  const processModel = makeProcessModel(actorModel, nodeModel, edgeModel);
  const projectModel = makeProjectModel(processModel);

  const activityNodeModel = makeActivityModel(nodeModel);
  const transitionEdgeModel = makeTransactionEdgeModel(edgeModel, nodeModel);
  const extendNodeModel = makeExtendNodeModel(nodeModel);
  const extendEdgeModel = makeExtendEdgeModel(edgeModel, nodeModel);

  return {
    actorModel,
    nodeModel,
    edgeModel,
    processModel,
    projectModel,
    activityNodeModel,
    transitionEdgeModel,
    extendNodeModel,
    extendEdgeModel,
  };
}

function makeDialogContext() {
  const [openProjectDialog, setOpenProjectDialog] = createSignal<boolean>(false);
  const [openProcessDialog, setOpenProcessDialog] = createSignal<ProcessEntity | null>(null);
  const [openActorDialog, setOpenActorDialog] = createSignal<ActorEntity | null>(null);
  const [openActivityDialog, setOpenActivityDialog] = createSignal<ActivityNode | null>(null);
  const [openTransitionDialog, setOpenTransitionDialog] = createSignal<TransitionEdge | null>(null);
  const [openCommentDialog, setOpenCommentDialog] = createSignal<CommentNode | null>(null);
  const [openLoadDialog, setOpenLoadDialog] = createSignal<boolean>(false);
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
    openLoadDialog,
    setOpenLoadDialog,
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
  }>({ fromX: 0, fromY: 0, toX: 0, toY: 0 });
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

const appContextValue = {
  ...makeModelContext(),
  dialog: makeDialogContext(),
  diagram: makeDiagramContext(),
  i18n: makeI18nContext(),
};

const AppContext = createContext<{
  actorModel: ReturnType<typeof makeActorModel>;
  nodeModel: ReturnType<typeof makeNodeModel>;
  edgeModel: ReturnType<typeof makeEdgeModel>;
  processModel: ReturnType<typeof makeProcessModel>;
  projectModel: ReturnType<typeof makeProjectModel>;
  activityNodeModel: ReturnType<typeof makeActivityModel>;
  transitionEdgeModel: ReturnType<typeof makeTransactionEdgeModel>;
  extendNodeModel: ReturnType<typeof makeExtendNodeModel>;
  extendEdgeModel: ReturnType<typeof makeExtendEdgeModel>;
  dialog: ReturnType<typeof makeDialogContext>;
  diagram: ReturnType<typeof makeDiagramContext>;
  i18n: ReturnType<typeof makeI18nContext>;
}>(appContextValue);

export function AppProvider(props: { children: JSX.Element }) {
  return <AppContext.Provider value={appContextValue}>{props.children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
