import { JSX, createContext, createSignal, useContext } from "solid-js";
import { ToolbarType } from "../components/toolbar/toolbar";
import { DragType } from "../diagram/disgram";

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
  const [dragType, setDragType] = createSignal<DragType>("none");
  const [addingLine, setAddingLine] = createSignal<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }>({ fromX: 0, fromY: 0, toX: 0, toY: 0 });

  return {
    toolbar: { toolbar, setToolbar },
    diagram: {
      zoom,
      setZoom,
      dragType,
      setDragType,
      addingLine,
      setAddingLine,
    },
  };
}

export function useDiagram() {
  return useContext(DiagramContext);
}
