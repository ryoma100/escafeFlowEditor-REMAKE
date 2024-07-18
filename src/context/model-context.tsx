import { createContext, JSX, useContext } from "solid-js";

import { makeActivityModel } from "@/data-model/activity-node-model";
import { makeActorModel } from "@/data-model/actor-model";
import { makeDiagramModel } from "@/data-model/diagram-model";
import { makeDialogModel } from "@/data-model/dialog-model";
import { makeEdgeModel } from "@/data-model/edge-model";
import { makeExtendEdgeModel } from "@/data-model/extend-edge-model";
import { makeExtendNodeModel } from "@/data-model/extend-node-model";
import { makeNodeModel } from "@/data-model/node-model";
import { makeProcessModel } from "@/data-model/process-model";
import { makeProjectModel } from "@/data-model/project-model";
import { makeTransactionEdgeModel } from "@/data-model/transaction-edge-model";

const actorModel = makeActorModel();
const nodeModel = makeNodeModel();
const edgeModel = makeEdgeModel(nodeModel);
const processModel = makeProcessModel(actorModel, nodeModel, edgeModel);
const projectModel = makeProjectModel(processModel);
const diagramModel = makeDiagramModel(nodeModel, edgeModel);
const activityNodeModel = makeActivityModel(nodeModel);
const transitionEdgeModel = makeTransactionEdgeModel(edgeModel, nodeModel);
const extendNodeModel = makeExtendNodeModel(nodeModel);
const extendEdgeModel = makeExtendEdgeModel(edgeModel, nodeModel);
const dialogModel = makeDialogModel();

const modelContextValue = {
  actorModel,
  nodeModel,
  edgeModel,
  processModel,
  projectModel,
  activityNodeModel,
  transitionEdgeModel,
  extendNodeModel,
  extendEdgeModel,
  diagramModel,
  dialogModel,
};

const ModelContext = createContext<{
  actorModel: ReturnType<typeof makeActorModel>;
  nodeModel: ReturnType<typeof makeNodeModel>;
  edgeModel: ReturnType<typeof makeEdgeModel>;
  processModel: ReturnType<typeof makeProcessModel>;
  projectModel: ReturnType<typeof makeProjectModel>;
  activityNodeModel: ReturnType<typeof makeActivityModel>;
  transitionEdgeModel: ReturnType<typeof makeTransactionEdgeModel>;
  extendNodeModel: ReturnType<typeof makeExtendNodeModel>;
  extendEdgeModel: ReturnType<typeof makeExtendEdgeModel>;
  diagramModel: ReturnType<typeof makeDiagramModel>;
  dialogModel: ReturnType<typeof makeDialogModel>;
}>(modelContextValue);

export function ModelProvider(props: {
  readonly onChange?: (e: Event) => void;
  readonly children: JSX.Element;
}) {
  return <ModelContext.Provider value={modelContextValue}>{props.children}</ModelContext.Provider>;
}

export function useModelContext() {
  return useContext(ModelContext);
}
