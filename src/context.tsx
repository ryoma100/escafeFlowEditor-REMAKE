import { createContext, useContext, JSX, createSignal } from "solid-js";
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

const DialogContext = createContext<ReturnType<typeof createDialogSignals>>({
  process: undefined as any,
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
  const [openProcessDialog, setOpenProcessDialog] = createSignal(false);
  return { process: { openProcessDialog, setOpenProcessDialog } };
}
