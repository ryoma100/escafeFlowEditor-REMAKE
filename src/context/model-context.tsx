import { JSX, createContext, useContext } from "solid-js";
import { packageModel } from "../models/package-model";
import { actorModel } from "../models/actor-model";
import { activityModel } from "../models/activity-model";
import { transitionModel } from "../models/transition-model";
import { processModel } from "../data-model/process-model";

const ModelContext = createContext<{
  pkg: ReturnType<typeof packageModel>;
  process: ReturnType<typeof processModel>;
  actor: ReturnType<typeof actorModel>;
  activity: ReturnType<typeof activityModel>;
  transition: ReturnType<typeof transitionModel>;
}>({
  pkg: undefined as any,
  process: undefined as any,
  actor: undefined as any,
  activity: undefined as any,
  transition: undefined as any,
});

export function ModelProvider(props: { children: JSX.Element }) {
  const activity = activityModel();

  const value = {
    pkg: packageModel(),
    process: processModel(),
    actor: actorModel(),
    activity,
    transition: transitionModel(activity),
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
