import { createContext, useContext, JSX, createSignal } from "solid-js";
import { ToolbarType } from "../components/toolbar/toolbar";

const OperationContext = createContext<
  ReturnType<typeof createOperationSignals>
>({
  toolbar: undefined as any,
  pkg: undefined as any,
  process: undefined as any,
  actor: undefined as any,
  activity: undefined as any,
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
  const [openActivityDialogById, setOpenActivityDialogById] = createSignal(0);
  return {
    toolbar: { toolbar, setToolbar },
    pkg: { openPackageDialog, setPackageDialog },
    process: { openProcessDialog, setOpenProcessDialog },
    actor: { openActorDialog, setOpenActorDialog },
    activity: { openActivityDialogById, setOpenActivityDialogById },
  };
}
