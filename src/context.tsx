import { createContext, useContext, JSX } from "solid-js";
import { processModel } from "./models/process-model";

const ModelContext = createContext<{
  process: ReturnType<typeof processModel>;
}>({ process: undefined as any });

export function ModelProvider(props: { children: JSX.Element }) {
  const value = { process: processModel() };

  return (
    <ModelContext.Provider value={value}>
      {props.children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  return useContext(ModelContext);
}
