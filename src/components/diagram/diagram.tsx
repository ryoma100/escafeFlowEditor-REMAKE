import { For, JSXElement, onMount, Show } from "solid-js";

import { makeMoveNodesStrategy } from "@/components/diagram/listeners/move-nodes-strategy";
import { makeRotateNodesStrategy } from "@/components/diagram/listeners/rotate-nodes-strategy";
import { makeScaleNodesStrategy } from "@/components/diagram/listeners/scale-nodes-strategy";
import { makeScrollStrategy } from "@/components/diagram/listeners/scroll-strategy";
import { makeSelectBoxStrategy } from "@/components/diagram/listeners/select-box-strategy";
import { makeSelectCircleStrategy } from "@/components/diagram/listeners/select-circle-strategy";
import { makeSelectStrategy } from "@/components/diagram/listeners/select-strategy";
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
  Point,
  Rectangle,
  StartEdge,
  StartNode,
  TransitionEdge,
} from "@/data-source/data-type";
import { centerPoint, lineDistance } from "@/utils/line-utils";
import { containsRect } from "@/utils/rectangle-utils";

import { ActivityNodeContainer } from "./activity-node";
import { ExtendEdgeContainer } from "./extend-edge";
import { ExtendNodeContainer } from "./extend-node";
import { TransitionEdgeContainer } from "./transition-edge";

export type PointerStrategy = {
  handlePointerDown(e: PointerEvent, node?: INode): void;
  handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>): void;
  handlePointerUp(e: PointerEvent): void;
};

export function DiagramContainer(): JSXElement {
  const { actorModel, diagramModel, nodeModel, activityNodeModel, extendNodeModel, edgeModel } =
    useModelContext();

  let pointerStrategy: PointerStrategy | null = null;
  function setPointerStrategy(strategy: PointerStrategy) {
    pointerStrategy = strategy;
  }

  onMount(() => {
    document.addEventListener("pointermove", handleDocumentPointerMove, { passive: true });
    document.addEventListener("pointerup", handleDocumentPointerUp);
  });

  const pointerEvents: Map<number, PointerEvent> = new Map();
  let mouseDownTime = new Date().getTime();

  function handleDiagramPointerDown(e: PointerEvent) {
    e.preventDefault();
    pointerEvents.set(e.pointerId, e);

    if (e.pointerType === "mouse" && e.button === 2) {
      const strategy = makeScrollStrategy(diagramModel);
      strategy.handlePointerDown(e);
      setPointerStrategy(strategy);
      return;
    }

    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (diagramModel.contextMenuPoint() != null) return;
    if (pointerStrategy != null) return;

    const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);
    switch (diagramModel.toolbar()) {
      case "cursor":
        {
          if (mouseDownTime + 250 > new Date().getTime()) {
            // onDoubleMouseDown
            if (e.ctrlKey || e.metaKey) {
              pointerStrategy = makeRotateNodesStrategy(diagramModel, nodeModel);
              pointerStrategy.handlePointerDown(e);
            } else if (e.shiftKey) {
              pointerStrategy = makeScaleNodesStrategy(diagramModel, nodeModel);
              pointerStrategy.handlePointerDown(e);
            } else {
              pointerStrategy = makeScrollStrategy(diagramModel);
              pointerStrategy.handlePointerDown(e);
            }
          } else {
            // onSingleMouseDown
            mouseDownTime = new Date().getTime();
            if (e.ctrlKey || e.metaKey) {
              pointerStrategy = makeSelectCircleStrategy(diagramModel, nodeModel, edgeModel);
              pointerStrategy.handlePointerDown(e);
            } else if (e.shiftKey) {
              pointerStrategy = makeSelectBoxStrategy(diagramModel, nodeModel, edgeModel);
              pointerStrategy.handlePointerDown(e);
            } else {
              pointerStrategy = makeSelectStrategy(diagramModel, nodeModel, edgeModel);
              pointerStrategy.handlePointerDown(e);
            }

            setTimeout(() => {
              if (pointerStrategy == null) {
                nodeModel.setNodeList(() => true, "selected", false);
                edgeModel.setEdgeList(() => true, "selected", false);
              }
            }, 250);
          }
        }
        return;
      case "addManualActivity":
        if (nodeModel.nodeList.every((it) => !containsRect(it, { x, y }))) {
          const activity = activityNodeModel.addActivity(
            "manualActivity",
            actorModel.selectedActor().id,
            x,
            y,
          );
          nodeModel.changeTopLayer(activity.id);
          nodeModel.changeSelectNodes("select", [activity.id]);
          const strategy = makeMoveNodesStrategy(diagramModel, nodeModel, edgeModel);
          strategy.handlePointerDown(e, activity);
          setPointerStrategy(strategy);
        }
        return;
      case "addAutoActivity":
        if (nodeModel.nodeList.every((it) => !containsRect(it, { x, y }))) {
          const activity = activityNodeModel.addActivity(
            "autoActivity",
            actorModel.selectedActor().id,
            x,
            y,
          );
          nodeModel.changeTopLayer(activity.id);
          nodeModel.changeSelectNodes("select", [activity.id]);
          const strategy = makeMoveNodesStrategy(diagramModel, nodeModel, edgeModel);
          strategy.handlePointerDown(e, activity);
          setPointerStrategy(strategy);
        }
        return;
      case "addUserActivity":
        if (nodeModel.nodeList.every((it) => !containsRect(it, { x, y }))) {
          const activity = activityNodeModel.addActivity(
            "userActivity",
            actorModel.selectedActor().id,
            x,
            y,
          );
          nodeModel.changeTopLayer(activity.id);
          nodeModel.changeSelectNodes("select", [activity.id]);
          const strategy = makeMoveNodesStrategy(diagramModel, nodeModel, edgeModel);
          strategy.handlePointerDown(e, activity);
          setPointerStrategy(strategy);
        }
        return;
      case "addCommentNode":
        if (nodeModel.nodeList.every((it) => !containsRect(it, { x, y }))) {
          const comment = extendNodeModel.addCommentNode(x, y);
          nodeModel.changeSelectNodes("select", [comment.id]);
          const strategy = makeMoveNodesStrategy(diagramModel, nodeModel, edgeModel);
          strategy.handlePointerDown(e, comment);
          setPointerStrategy(strategy);
        }
        return;
      case "addStartNode":
        if (nodeModel.nodeList.every((it) => !containsRect(it, { x, y }))) {
          const startNode = extendNodeModel.addStartNode(x, y);
          nodeModel.changeSelectNodes("select", [startNode.id]);
          const strategy = makeMoveNodesStrategy(diagramModel, nodeModel, edgeModel);
          strategy.handlePointerDown(e, startNode);
          setPointerStrategy(strategy);
        }
        return;
      case "addEndNode":
        if (nodeModel.nodeList.every((it) => !containsRect(it, { x, y }))) {
          const endNode = extendNodeModel.addEndNode(x, y);
          nodeModel.changeSelectNodes("select", [endNode.id]);
          const strategy = makeMoveNodesStrategy(diagramModel, nodeModel, edgeModel);
          strategy.handlePointerDown(e, endNode);
          setPointerStrategy(strategy);
        }
        return;
    }
  }

  function handleDocumentPointerMove(e: PointerEvent) {
    if (pointerStrategy != null) {
      pointerStrategy.handlePointerMove(e, pointerEvents);
      pointerEvents.set(e.pointerId, e);
      return;
    }

    const prevEvent = pointerEvents.get(e.pointerId);
    if (prevEvent == null || pointerEvents.size > 2) return;

    if (pointerEvents.size === 2) {
      const prevEvents = Array.from(pointerEvents.values());
      const prevP1: Point = { x: prevEvents[0].clientX, y: prevEvents[0].clientY };
      const prevP2: Point = { x: prevEvents[1].clientX, y: prevEvents[1].clientY };
      const prevTouchPoints = { p1: prevP1, p2: prevP2 };
      const prevCenterPoint = centerPoint(prevTouchPoints);
      const prevDistance = lineDistance(prevTouchPoints);

      pointerEvents.set(e.pointerId, e);
      const newEvents = Array.from(pointerEvents.values());
      const newP1: Point = { x: newEvents[0].clientX, y: newEvents[0].clientY };
      const newP2: Point = { x: newEvents[1].clientX, y: newEvents[1].clientY };
      const newTouchPoints = { p1: newP1, p2: newP2 };
      const newCenterPoint = centerPoint(newTouchPoints);
      const newDistance = lineDistance(newTouchPoints);

      diagramModel.changeZoom(
        diagramModel.zoom() + (newDistance - prevDistance) / prevDistance,
        newCenterPoint,
      );
      diagramModel.setViewBox({
        x: diagramModel.viewBox().x - (newCenterPoint.x - prevCenterPoint.x),
        y: diagramModel.viewBox().y - (newCenterPoint.y - prevCenterPoint.y),
        width: diagramModel.viewBox().width,
        height: diagramModel.viewBox().height,
      });
      return;
    }

    pointerEvents.set(e.pointerId, e);
  }

  function handleDocumentPointerUp(e: PointerEvent) {
    pointerEvents.delete(e.pointerId);

    pointerStrategy?.handlePointerUp(e);
    pointerStrategy = null;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      diagramModel.setToolbar("cursor");
    }
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
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

  function handleWheel(e: WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      const newZoom = (diagramModel.zoom() * 100 + -e.deltaY) / 100;
      diagramModel.changeZoom(newZoom, { x: e.clientX, y: e.clientY });
    } else {
      diagramModel.setViewBox({
        x: diagramModel.viewBox().x + e.deltaX * 2,
        y: diagramModel.viewBox().y + e.deltaY * 2,
        width: diagramModel.viewBox().width,
        height: diagramModel.viewBox().height,
      });
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
        onPointerDown={handleDiagramPointerDown}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
        setPointerStrategy={setPointerStrategy}
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
  readonly onPointerDown?: (e: PointerEvent) => void;
  readonly onKeyDown?: (e: KeyboardEvent) => void;
  readonly onContextMenu?: (e: MouseEvent) => void;
  readonly onWheel?: (e: WheelEvent) => void;
  readonly setPointerStrategy?: (strategy: PointerStrategy) => void;
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
      onPointerDown={(e) => props.onPointerDown?.(e)}
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
        <g data-id="extend-edges">
          <For each={props.edgeList.filter((it) => it.type !== "transitionEdge")}>
            {(it) => <ExtendEdgeContainer edge={it as StartEdge | EndEdge | CommentEdge} />}
          </For>
        </g>
        <g data-id="activity-nodes">
          <For each={props.nodeList.filter((it) => it.type === "activityNode")}>
            {(it) => (
              <ActivityNodeContainer
                activity={it as ActivityNode}
                setPointerStrategy={props.setPointerStrategy}
              />
            )}
          </For>
        </g>
        <g data-id="extend-nodes">
          <For each={props.nodeList.filter((it) => it.type !== "activityNode")}>
            {(it) => (
              <ExtendNodeContainer
                node={it as StartNode | EndNode | CommentNode}
                setPointerStrategy={props.setPointerStrategy}
              />
            )}
          </For>
        </g>
        <g data-id="transition-edges">
          <For each={props.edgeList.filter((it) => it.type === "transitionEdge")}>
            {(it) => <TransitionEdgeContainer transition={it as TransitionEdge} />}
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
