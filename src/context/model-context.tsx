import { JSX, createContext, useContext } from "solid-js";
import { processModel } from "../models/process-model";
import { packageModel } from "../models/package-model";
import { actorModel } from "../models/actor-model";

const ModelContext = createContext<{
  pkg: ReturnType<typeof packageModel>;
  process: ReturnType<typeof processModel>;
  actor: ReturnType<typeof actorModel>;
}>({
  pkg: undefined as any,
  process: undefined as any,
  actor: undefined as any,
});

export function ModelProvider(props: { children: JSX.Element }) {
  const value = {
    pkg: packageModel(),
    process: processModel(),
    actor: actorModel(),
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
