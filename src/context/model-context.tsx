import { JSX, createContext, useContext } from "solid-js";
import { createPackageModel } from "../models/package-model";
import { createActivityModel } from "../models/activity-model";
import { createTransitionModel as createTransitionModel } from "../models/transition-model";
import { createProcessModel as createProcessModel } from "../models/process-model";
import { createActorModel } from "../models/actor-model";

const ModelContext = createContext<{
  packageModel: ReturnType<typeof createPackageModel>;
  processModel: ReturnType<typeof createProcessModel>;
  actorModel: ReturnType<typeof createActorModel>;
  activityModel: ReturnType<typeof createActivityModel>;
  transitionModel: ReturnType<typeof createTransitionModel>;
}>({
  packageModel: undefined as any,
  processModel: undefined as any,
  actorModel: undefined as any,
  activityModel: undefined as any,
  transitionModel: undefined as any,
});

export function ModelProvider(props: { children: JSX.Element }) {
  const packageModel = createPackageModel();
  const actorModel = createActorModel();
  const activityModel = createActivityModel(actorModel);
  const transitionModel = createTransitionModel(activityModel);
  const processModel = createProcessModel(actorModel, activityModel);

  const value = {
    packageModel,
    processModel,
    actorModel,
    activityModel,
    transitionModel,
  };

  return (
    <ModelContext.Provider value={value}>
      {props.children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  return useContext(ModelContext);
}
