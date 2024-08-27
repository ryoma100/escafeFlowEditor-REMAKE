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

function makeModelContext() {
  const diagramModel = makeDiagramModel();
  const nodeModel = makeNodeModel(diagramModel);
  const edgeModel = makeEdgeModel(nodeModel);
  const actorModel = makeActorModel();
  const processModel = makeProcessModel(actorModel, nodeModel, edgeModel);
  const projectModel = makeProjectModel(processModel);
  const activityNodeModel = makeActivityModel(nodeModel);
  const transitionEdgeModel = makeTransactionEdgeModel(edgeModel, nodeModel);
  const extendNodeModel = makeExtendNodeModel(nodeModel);
  const extendEdgeModel = makeExtendEdgeModel(edgeModel, nodeModel);
  const dialogModel = makeDialogModel();

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
    diagramModel,
    dialogModel,
  };
}

const dummyValue = undefined as unknown as ReturnType<typeof makeModelContext>;
const ModelContext = createContext(dummyValue);

export function ModelProvider(props: {
  readonly onChange?: (e: Event) => void;
  readonly children: JSX.Element;
}) {
  const value = makeModelContext();
  return <ModelContext.Provider value={value}>{props.children}</ModelContext.Provider>;
}

export function useModelContext() {
  return useContext(ModelContext);
}
