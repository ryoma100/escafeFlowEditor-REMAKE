import { createContext, useContext, JSX, createSignal } from "solid-js";
import { processModel } from "./models/process-model";
import { packageModel } from "./models/package-model";
import { actorModel } from "./models/actor-model";
import { ToolbarType } from "./components/toolbar/toolbar";

/** モデルContext */
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

/** 操作Context */
const OperationContext = createContext<
  ReturnType<typeof createOperationSignals>
>({
  toolbar: undefined as any,
  pkg: undefined as any,
  process: undefined as any,
  actor: undefined as any,
});

export function OperationProvider(props: { children: JSX.Element }) {
  const value = createOperationSignals();

  return (
    <OperationContext.Provider value={value}>
      {props.children}
    </OperationContext.Provider>
  );
}

export function useOperation() {
  return useContext(OperationContext);
}

function createOperationSignals() {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [openPackageDialog, setPackageDialog] = createSignal(false);
  const [openProcessDialog, setOpenProcessDialog] = createSignal(false);
  const [openActorDialog, setOpenActorDialog] = createSignal(false);
  return {
    toolbar: { toolbar, setToolbar },
    pkg: { openPackageDialog, setPackageDialog },
    process: { openProcessDialog, setOpenProcessDialog },
    actor: { openActorDialog, setOpenActorDialog },
  };
}
