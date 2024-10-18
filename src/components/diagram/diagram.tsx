import { createSignal, For, JSXElement, onMount, Show } from "solid-js";
import { produce } from "solid-js/store";

import { ContextMenu } from "@/components/parts/context-menu";
import { defaultCircle, defaultRectangle, GRID_SPACING } from "@/constants/app-const";
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
import { pointLength } from "@/utils/point-utils";
import { containsRect, intersectRect, minLengthOfPointToRect } from "@/utils/rectangle-utils";

import { ActivityNodeContainer } from "./activity-node";
import { ExtendEdgeContainer } from "./extend-edge";
import { ExtendNodeContainer } from "./extend-node";
import { TransitionEdgeContainer } from "./transition-edge";

export function DiagramContainer(): JSXElement {
  const {
    actorModel: { selectedActor },
    nodeModel: {
      nodeList,
      changeSelectNodes,
      moveSelectedNodes,
      changeTopLayer,
      setNodeList,
      scaleSelectedNodes,
      rotateSelectedNodes,
    },
    edgeModel: { edgeList, setEdgeList },
    activityNodeModel: { addActivity, resizeLeft, resizeRight, updateJoinType, updateSplitType },
    transitionEdgeModel: { addTransitionEdge, getTransitionEdges },
    extendNodeModel: { addCommentNode, addStartNode, addEndNode },
    extendEdgeModel: { addCommentEdge, addStartEdge, addEndEdge },
    diagramModel: {
      svgRect,
      changeSvgRect,
      viewBox,
      setViewBox,
      graphRect,
      toolbar,
      setToolbar,
      zoom,
      changeZoom,
      dragMode,
      setDragMode,
      addingLine,
      setAddingLineTo,
    },
  } = useModelContext();

  const [selectBox, setSelectBox] = createSignal<Rectangle>(defaultRectangle);
  const [selectCircle, setSelectCircle] = createSignal<Circle>(defaultCircle);
  const [contextMenuPoint, setContextMenuPoint] = createSignal<Point | null>(null);

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
      setDragMode({ type: "contextMenuScroll" });
      return;
    }

    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (contextMenuPoint() != null) return;
    if (dragMode().type !== "none") return;

    const x = viewBox().x + (e.clientX - svgRect().x) / zoom();
    const y = viewBox().y + (e.clientY - svgRect().y) / zoom();
    switch (toolbar()) {
      case "cursor":
        {
          if (mouseDownTime + 250 > new Date().getTime()) {
            // onDoubleMouseDown
            if (e.ctrlKey || e.metaKey) {
              setDragMode({
                type: "rotateNodes",
                basePoint: { x, y },
              });
            } else if (e.shiftKey) {
              setDragMode({
                type: "scaleNodes",
                basePoint: { x, y },
              });
            } else {
              setDragMode({ type: "scroll" });
            }
          } else {
            // onSingleMouseDown
            mouseDownTime = new Date().getTime();
            setSelectBox(defaultRectangle);
            setSelectCircle(defaultCircle);
            if (e.ctrlKey || e.metaKey) {
              setDragMode({ type: "circleSelect", centerPoint: { x, y } });
            } else if (e.shiftKey) {
              setDragMode({ type: "boxSelect", centerPoint: { x, y } });
            } else {
              setDragMode({ type: "select", startPoint: { x, y } });
            }

            setTimeout(() => {
              if (dragMode().type === "none") {
                setNodeList(() => true, "selected", false);
                setEdgeList(() => true, "selected", false);
              }
            }, 250);
          }
        }
        return;
      case "addManualActivity":
        if (nodeList.every((it) => !containsRect(it, { x, y }))) {
          const activity = addActivity("manualActivity", selectedActor().id, x, y);
          changeTopLayer(activity.id);
          changeSelectNodes("select", [activity.id]);
          setDragMode({ type: "addActivity" });
        }
        return;
      case "addAutoActivity":
        if (nodeList.every((it) => !containsRect(it, { x, y }))) {
          const activity = addActivity("autoActivity", selectedActor().id, x, y);
          changeTopLayer(activity.id);
          changeSelectNodes("select", [activity.id]);
          setDragMode({ type: "addActivity" });
        }
        return;
      case "addUserActivity":
        if (nodeList.every((it) => !containsRect(it, { x, y }))) {
          const activity = addActivity("userActivity", selectedActor().id, x, y);
          changeTopLayer(activity.id);
          changeSelectNodes("select", [activity.id]);
          setDragMode({ type: "addActivity" });
        }
        return;
      case "addCommentNode":
        if (nodeList.every((it) => !containsRect(it, { x, y }))) {
          const comment = addCommentNode(x, y);
          changeSelectNodes("select", [comment.id]);
          setDragMode({ type: "addCommentNode" });
        }
        return;
      case "addStartNode":
        if (nodeList.every((it) => !containsRect(it, { x, y }))) {
          const startNode = addStartNode(x, y);
          changeSelectNodes("select", [startNode.id]);
          setDragMode({ type: "addStartNode" });
        }
        return;
      case "addEndNode":
        if (nodeList.every((it) => !containsRect(it, { x, y }))) {
          const endNode = addEndNode(x, y);
          changeSelectNodes("select", [endNode.id]);
          setDragMode({ type: "addEndNode" });
        }
        return;
    }
  }

  function handleDocumentPointerMove(e: PointerEvent) {
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

      changeZoom(zoom() + (newDistance - prevDistance) / prevDistance, newCenterPoint);
      setViewBox({
        x: viewBox().x - (newCenterPoint.x - prevCenterPoint.x),
        y: viewBox().y - (newCenterPoint.y - prevCenterPoint.y),
        width: viewBox().width,
        height: viewBox().height,
      });
      return;
    }

    const moveX = (e.clientX - prevEvent.clientX) / zoom();
    const moveY = (e.clientY - prevEvent.clientY) / zoom();
    const x = viewBox().x + (e.clientX - svgRect().x) / zoom();
    const y = viewBox().y + (e.clientY - svgRect().y) / zoom();

    pointerEvents.set(e.pointerId, e);

    const drag = dragMode();
    switch (drag.type) {
      case "select":
        {
          const rect: Rectangle = {
            x: Math.min(drag.startPoint.x, x),
            y: Math.min(drag.startPoint.y, y),
            width: Math.abs(x - drag.startPoint.x),
            height: Math.abs(y - drag.startPoint.y),
          };
          setSelectBox(rect);
          setNodeList(
            () => true,
            produce((it) => (it.selected = intersectRect(rect, it))),
          );
          setEdgeList(() => true, "selected", false);
        }
        return;
      case "boxSelect":
        {
          const diffX = Math.abs(x - drag.centerPoint.x);
          const diffY = Math.abs(y - drag.centerPoint.y);
          const rect: Rectangle = {
            x: drag.centerPoint.x - diffX,
            y: drag.centerPoint.y - diffY,
            width: diffX * 2,
            height: diffY * 2,
          };
          setSelectBox(rect);
          setNodeList(
            (_it) => true,
            produce((it) => (it.selected = intersectRect(rect, it))),
          );
          setEdgeList(() => true, "selected", false);
        }
        return;
      case "circleSelect":
        {
          const r = pointLength(drag.centerPoint, { x, y });
          setSelectCircle({ cx: drag.centerPoint.x, cy: drag.centerPoint.y, r });
          setNodeList(
            (_it) => true,
            produce((it) => (it.selected = minLengthOfPointToRect(drag.centerPoint, it) < r)),
          );
          setEdgeList(() => true, "selected", false);
        }
        return;
      case "scroll":
        setViewBox({
          x: viewBox().x - moveX,
          y: viewBox().y - moveY,
          width: viewBox().width,
          height: viewBox().height,
        });
        return;
      case "contextMenuScroll":
        if (contextMenuPoint() == null) {
          setDragMode({ type: "scroll" });
          setViewBox({
            x: viewBox().x - moveX,
            y: viewBox().y - moveY,
            width: viewBox().width,
            height: viewBox().height,
          });
        }
        return;
      case "addActivity":
      case "addCommentNode":
      case "addStartNode":
      case "addEndNode":
      case "moveNodes":
        moveSelectedNodes(moveX, moveY);
        return;
      case "scaleNodes":
        scaleSelectedNodes(drag.basePoint, moveX, moveY);
        return;
      case "rotateNodes":
        rotateSelectedNodes(drag.basePoint, moveX, moveY);
        return;
      case "resizeActivityLeft":
        resizeLeft(moveX);
        return;
      case "resizeActivityRight":
        resizeRight(moveX);
        return;
      case "addTransition":
      case "addCommentEdge":
      case "addStartEdge":
        setAddingLineTo(
          viewBox().x + (e.clientX - svgRect().x) / zoom(),
          viewBox().y + (e.clientY - svgRect().y) / zoom(),
        );
        return;
    }
  }

  function handleDocumentPointerUp(e: PointerEvent) {
    pointerEvents.delete(e.pointerId);

    if (dragMode().type === "contextMenuScroll") {
      setContextMenuPoint({ x: e.pageX, y: e.pageY });
      return;
    }

    const x = viewBox().x + (e.clientX - svgRect().x) / zoom();
    const y = viewBox().y + (e.clientY - svgRect().y) / zoom();
    const node = nodeList.find((it) => containsRect(it, { x, y }));
    switch (dragMode().type) {
      case "addTransition":
        if (node?.type === "activityNode") {
          const transition = addTransitionEdge(node.id);
          if (transition) {
            updateJoinType(
              transition.toNodeId,
              getTransitionEdges().filter((it) => it.toNodeId === transition.toNodeId).length,
            );
            updateSplitType(
              transition.fromNodeId,
              getTransitionEdges().filter((it) => it.fromNodeId === transition.fromNodeId).length,
            );
          }
        } else if (node?.type === "endNode") {
          addEndEdge(node.id);
        }
        break;
      case "addCommentEdge":
        if (node?.type === "activityNode") {
          addCommentEdge(node.id);
        }
        break;
      case "addStartEdge":
        if (node?.type === "activityNode") {
          addStartEdge(node.id);
        }
        break;
    }

    setDragMode({ type: "none" });
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      setToolbar("cursor");
    }
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
  }

  function onContextMenuSelect(menuItem: keyof I18nDict | null) {
    setContextMenuPoint(null);
    switch (menuItem) {
      case "select":
        setToolbar("cursor");
        return;
      case "transition":
        setToolbar("transition");
        return;
      case "manualActivity":
        setToolbar("addManualActivity");
        return;
      case "autoActivity":
        setToolbar("addAutoActivity");
        return;
      case "handWork":
        setToolbar("addUserActivity");
        return;
      case "start":
        setToolbar("addStartNode");
        return;
      case "end":
        setToolbar("addEndNode");
        return;
      case "comment":
        setToolbar("addCommentNode");
        return;
    }
  }

  function handleWheel(e: WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      const newZoom = (zoom() * 100 + -e.deltaY) / 100;
      changeZoom(newZoom, { x: e.clientX, y: e.clientY });
    } else {
      setViewBox({
        x: viewBox().x + e.deltaX * 2,
        y: viewBox().y + e.deltaY * 2,
        width: viewBox().width,
        height: viewBox().height,
      });
    }
  }

  function gridLines(): Line[] {
    const rect = graphRect();
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
        viewBox={viewBox()}
        svgRect={svgRect()}
        changeSvgRect={changeSvgRect}
        gridLines={gridLines()}
        nodeList={nodeList}
        edgeList={edgeList}
        addingLine={
          dragMode().type === "addTransition" ||
          dragMode().type === "addStartEdge" ||
          dragMode().type === "addEndEdge" ||
          dragMode().type === "addCommentEdge"
            ? addingLine()
            : null
        }
        selectBox={
          dragMode().type === "select" || dragMode().type === "boxSelect" ? selectBox() : null
        }
        selectCircle={dragMode().type === "circleSelect" ? selectCircle() : null}
        onPointerDown={handleDiagramPointerDown}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
      />

      <ContextMenu
        openPoint={contextMenuPoint()}
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
            {(it) => <ActivityNodeContainer activity={it as ActivityNode} />}
          </For>
        </g>
        <g data-id="extend-nodes">
          <For each={props.nodeList.filter((it) => it.type !== "activityNode")}>
            {(it) => <ExtendNodeContainer node={it as StartNode | EndNode | CommentNode} />}
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
