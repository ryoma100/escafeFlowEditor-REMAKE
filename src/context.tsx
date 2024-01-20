import { createContext, useContext, JSX, createSignal } from "solid-js";
import { processModel } from "./models/process-model";
import { packageModel } from "./models/package-model";
import { actorModel } from "./models/actor-model";

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

/** ダイアログContext */
const DialogContext = createContext<ReturnType<typeof createDialogSignals>>({
  pkg: undefined as any,
  process: undefined as any,
  actor: undefined as any,
});

export function DialogProvider(props: { children: JSX.Element }) {
  const value = createDialogSignals();

  return (
    <DialogContext.Provider value={value}>
      {props.children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  return useContext(DialogContext);
}

function createDialogSignals() {
  const [openPackageDialog, setPackageDialog] = createSignal(false);
  const [openProcessDialog, setOpenProcessDialog] = createSignal(false);
  const [openActorDialog, setOpenActorDialog] = createSignal(false);
  return {
    pkg: { openPackageDialog, setPackageDialog },
    process: { openProcessDialog, setOpenProcessDialog },
    actor: { openActorDialog, setOpenActorDialog },
  };
}
