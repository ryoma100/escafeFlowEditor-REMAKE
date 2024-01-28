import { JSX, createContext, createSignal, useContext } from "solid-js";
import { ToolbarType } from "../components/toolbar/toolbar";

const DiagramContext = createContext<ReturnType<typeof createDialogSignals>>({
  toolbar: undefined as any,
  diagram: undefined as any,
});

export function DiagramProvider(props: { children: JSX.Element }) {
  const value = createDialogSignals();

  return (
    <DiagramContext.Provider value={value}>
      {props.children}
    </DiagramContext.Provider>
  );
}

function createDialogSignals() {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [zoom, setZoom] = createSignal<number>(1);

  return {
    toolbar: { toolbar, setToolbar },
    diagram: { zoom, setZoom },
  };
}

export function useDiagram() {
  return useContext(DiagramContext);
}
