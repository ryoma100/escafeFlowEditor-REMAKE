import { For, JSXElement, onMount, Show } from "solid-js";

import { makePointerListener } from "@/components/diagram/listener/pointer-listener";
import { makeWheelListener } from "@/components/diagram/listener/wheel-listener";
import { ContextMenu } from "@/components/parts/context-menu";
import { GRID_SPACING } from "@/constants/app-const";
import { I18nDict } from "@/constants/i18n";
import { useModelContext } from "@/context/model-context";
import {
  ActivityNode,
  Circle,
  CommentEdge,
  CommentNode,
  EndEdge,
  EndNode,
  IEdge,
  INode,
  Line,
  NodeId,
  Rectangle,
  StartEdge,
  StartNode,
  TransitionEdge,
} from "@/data-source/data-type";

import { ActivityNodeContainer } from "./activity-node";
import { ExtendEdgeContainer } from "./extend-edge";
import { ExtendNodeContainer } from "./extend-node";
import { TransitionEdgeContainer } from "./transition-edge";

export function DiagramContainer(): JSXElement {
  const {
    actorModel,
    diagramModel,
    nodeModel,
    activityNodeModel,
    extendNodeModel,
    extendEdgeModel,
    edgeModel,
    transitionEdgeModel,
  } = useModelContext();
  const pointerListener = makePointerListener(
    diagramModel,
    nodeModel,
    edgeModel,
    activityNodeModel,
    transitionEdgeModel,
    extendNodeModel,
    extendEdgeModel,
    actorModel,
  );

  onMount(() => {
    document.addEventListener("pointermove", pointerListener.handleDocumentPointerMove, {
      passive: true,
    });
    document.addEventListener("pointerup", pointerListener.handleDocumentPointerUp);
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      diagramModel.setToolbar("cursor");
    }
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault(); // Do not show default context menu
  }

  function onContextMenuSelect(menuItem: keyof I18nDict | null) {
    diagramModel.setContextMenuPoint(null);
    switch (menuItem) {
      case "select":
        diagramModel.setToolbar("cursor");
        return;
      case "transition":
        diagramModel.setToolbar("transition");
        return;
      case "manualActivity":
        diagramModel.setToolbar("addManualActivity");
        return;
      case "autoActivity":
        diagramModel.setToolbar("addAutoActivity");
        return;
      case "handWork":
        diagramModel.setToolbar("addUserActivity");
        return;
      case "start":
        diagramModel.setToolbar("addStartNode");
        return;
      case "end":
        diagramModel.setToolbar("addEndNode");
        return;
      case "comment":
        diagramModel.setToolbar("addCommentNode");
        return;
    }
  }

  function gridLines(): Line[] {
    const rect = diagramModel.graphRect();
    if (rect.width === 0) return [];

    const dx = rect.x % GRID_SPACING;
    const dy = rect.y % GRID_SPACING;
    const lines: Line[] = [];
    for (let x = 0; x < rect.width + dx; x += GRID_SPACING) {
      if (x + rect.x - dx > rect.x) {
        lines.push({
          p1: { x: x + rect.x - dx, y: rect.y },
          p2: { x: x + rect.x - dx, y: rect.y + rect.height },
        });
      }
    }
    for (let y = 0; y < rect.height + dy; y += GRID_SPACING) {
      if (y + rect.y - dy > rect.y) {
        lines.push({
          p1: { x: rect.x, y: y + rect.y - dy },
          p2: { x: rect.x + rect.width, y: y + rect.y - dy },
        });
      }
    }
    return lines;
  }

  return (
    <>
      <DiagramView
        viewBox={diagramModel.viewBox()}
        svgRect={diagramModel.svgRect()}
        changeSvgRect={diagramModel.changeSvgRect}
        gridLines={gridLines()}
        nodeList={nodeModel.nodeList}
        edgeList={edgeModel.edgeList}
        addingLine={diagramModel.addingLine()}
        selectBox={diagramModel.selectBox()}
        selectCircle={diagramModel.selectCircle()}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        onWheel={makeWheelListener(diagramModel).handleWheel}
        onDiagramPointerDown={pointerListener.handleDiagramPointerDown}
        onActivityLeftPointerDown={pointerListener.handleActivityLeftPointerDown}
        onActivityPointerDown={pointerListener.handleActivityPointerDown}
        onActivityRightPointerDown={pointerListener.handleActivityRightPointerDown}
        onExtendNodePointerDown={pointerListener.handleExtendNodePointerDown}
        onFromEdgePointerDown={pointerListener.handleMoveStartEdgePointerDown}
        onToEdgePointerDown={pointerListener.handleMoveEndEdgePointerDown}
      />

      <ContextMenu
        openPoint={diagramModel.contextMenuPoint()}
        menuItems={[
          "select",
          "transition",
          "manualActivity",
          "autoActivity",
          "handWork",
          "start",
          "end",
          "comment",
        ]}
        onClickMenu={onContextMenuSelect}
      />
    </>
  );
}

export function DiagramView(props: {
  readonly viewBox: Rectangle;
  readonly svgRect: Rectangle;
  readonly gridLines: Line[];
  readonly nodeList: INode[];
  readonly edgeList: IEdge[];
  readonly addingLine: Line | null;
  readonly selectBox: Rectangle | null;
  readonly selectCircle: Circle | null;
  readonly changeSvgRect?: (rect: Rectangle) => void;
  readonly onKeyDown?: (e: KeyboardEvent) => void;
  readonly onContextMenu?: (e: MouseEvent) => void;
  readonly onWheel?: (e: WheelEvent) => void;
  readonly onDiagramPointerDown?: (e: PointerEvent) => void;
  readonly onActivityLeftPointerDown?: (e: PointerEvent, activity: ActivityNode) => void;
  readonly onActivityPointerDown?: (e: PointerEvent, activity: ActivityNode) => void;
  readonly onActivityRightPointerDown?: (e: PointerEvent, activity: ActivityNode) => void;
  readonly onExtendNodePointerDown?: (e: PointerEvent, node: INode) => void;
  readonly onFromEdgePointerDown?: (e: PointerEvent, edge: IEdge, endNodeId: NodeId) => void;
  readonly onToEdgePointerDown?: (e: PointerEvent, edge: IEdge, startNodeId: NodeId) => void;
}) {
  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (diagramRef) {
        const rect = diagramRef.getBoundingClientRect();
        props.changeSvgRect?.({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
        if (props.onWheel) {
          diagramRef.addEventListener("wheel", props.onWheel, { passive: true });
        }
      }
    });
    if (diagramRef) {
      if (props.onWheel) {
        diagramRef.removeEventListener("wheel", props.onWheel);
      }
      observer.observe(diagramRef);
    }
  });

  let diagramRef: HTMLDivElement | undefined;
  return (
    <div
      class="relative size-full touch-none outline-none"
      ref={diagramRef}
      tabindex={-1}
      onKeyDown={(e) => props.onKeyDown?.(e)}
      onPointerDown={(e) => props.onDiagramPointerDown?.(e)}
      onContextMenu={(e) => props.onContextMenu?.(e)}
    >
      <svg
        class="absolute inset-0 size-full"
        width={props.svgRect.width}
        height={props.svgRect.height}
        viewBox={`${props.viewBox.x} ${props.viewBox.y} ${props.viewBox.width} ${props.viewBox.height}`}
      >
        <defs>
          <marker
            id="arrow-end"
            viewBox="0 0 40 20"
            refX="40"
            refY="10"
            orient="auto"
            markerWidth="20"
            markerHeight="20"
          >
            <polygon points="20,0 40,10 20,20" fill="var(--foreground-color)" />
          </marker>
          <marker
            id="ognl-arrow-end"
            viewBox="0 0 40 20"
            refX="40"
            refY="10"
            markerUnits="strokeWidth"
            orient="auto"
            markerWidth="20"
            markerHeight="20"
          >
            <polygon points="5,0 5,20, 8,20 8,0" fill="gray" />
            <polygon points="12,0 12,20, 15,20 15,0" fill="gray" />
            <polygon points="20,0 40,10 20,20" fill="gray" />
          </marker>
        </defs>
        <g data-id="gird-line">
          <For each={props.gridLines}>
            {(it) => (
              <line
                x1={it.p1.x}
                y1={it.p1.y}
                x2={it.p2.x}
                y2={it.p2.y}
                stroke="var(--gridline-color)"
              />
            )}
          </For>
        </g>

        <g data-id="activity-nodes">
          <For each={props.nodeList.filter((it) => it.type === "activityNode")}>
            {(it) => (
              <ActivityNodeContainer
                activity={it as ActivityNode}
                onActivityLeftPointerDown={props.onActivityLeftPointerDown}
                onActivityPointerDown={props.onActivityPointerDown}
                onActivityRightPointerDown={props.onActivityRightPointerDown}
              />
            )}
          </For>
        </g>
        <g data-id="extend-nodes">
          <For each={props.nodeList.filter((it) => it.type !== "activityNode")}>
            {(it) => (
              <ExtendNodeContainer
                node={it as StartNode | EndNode | CommentNode}
                onExtendNodePointerDown={props.onExtendNodePointerDown}
              />
            )}
          </For>
        </g>
        <g data-id="transition-edges">
          <For each={props.edgeList.filter((it) => it.type === "transitionEdge")}>
            {(it) => (
              <TransitionEdgeContainer
                transition={it as TransitionEdge}
                onFromPointerDown={(e, nodeId) => props.onFromEdgePointerDown?.(e, it, nodeId)}
                onToPointerDown={(e, nodeId) => props.onToEdgePointerDown?.(e, it, nodeId)}
              />
            )}
          </For>
        </g>
        <g data-id="extend-edges">
          <For each={props.edgeList.filter((it) => it.type !== "transitionEdge")}>
            {(it) => (
              <ExtendEdgeContainer
                edge={it as StartEdge | EndEdge | CommentEdge}
                onFromPointerDown={(e, nodeId) => props.onFromEdgePointerDown?.(e, it, nodeId)}
                onToPointerDown={(e, nodeId) => props.onToEdgePointerDown?.(e, it, nodeId)}
              />
            )}
          </For>
        </g>
        <g data-id="adding-line">
          <Show when={props.addingLine != null}>
            <line
              class="pointer-events-none fill-none stroke-foreground stroke-2"
              x1={props.addingLine?.p1.x}
              y1={props.addingLine?.p1.y}
              x2={props.addingLine?.p2.x}
              y2={props.addingLine?.p2.y}
            />
          </Show>
        </g>

        <g data-id="select-box">
          <Show when={props.selectBox != null}>
            <rect
              class="pointer-events-none fill-secondary stroke-primary opacity-50"
              x={props.selectBox?.x}
              y={props.selectBox?.y}
              width={props.selectBox?.width}
              height={props.selectBox?.height}
            />
          </Show>
        </g>
        <g data-id="select-circle">
          <Show when={props.selectCircle != null}>
            <circle
              class="pointer-events-none fill-secondary stroke-primary opacity-50"
              cx={props.selectCircle?.cx}
              cy={props.selectCircle?.cy}
              r={props.selectCircle?.r}
            />
          </Show>
        </g>
      </svg>
    </div>
  );
}
