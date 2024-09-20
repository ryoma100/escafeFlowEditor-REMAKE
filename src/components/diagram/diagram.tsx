import { createSignal, For, JSXElement, onMount, Show } from "solid-js";
import { produce } from "solid-js/store";

import { ContextMenu } from "@/components/parts/context-menu";
import { defaultCircle, defaultPoint, defaultRectangle, GRID_SPACING } from "@/constants/app-const";
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
import { pointLength } from "@/utils/point-utils";
import { containsRect, intersectRect, minLengthOfPointToRect } from "@/utils/rectangle-utils";

import { ActivityNodeContainer } from "./activity-node";
import { ExtendEdgeContainer } from "./extend-edge";
import { ExtendNodeContainer } from "./extend-node";
import { TransitionEdgeContainer } from "./transition-edge";

export function DiagramContainer(): JSXElement {
  const {
    activityNodeModel: { addActivity, resizeLeft, resizeRight },
    actorModel: { selectedActor },
    extendNodeModel: { addCommentNode, addStartNode, addEndNode },
    nodeModel: {
      changeSelectNodes,
      moveSelectedNodes,
      changeTopLayer,
      nodeList,
      setNodeList,
      scaleSelectedNodes,
      rotateSelectedNodes,
    },
    edgeModel: { edgeList, setEdgeList },
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
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("touchmove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
    document.addEventListener("touchend", handleDocumentMouseUp);
  });

  let prevClientPoint: Point = defaultPoint;
  let mouseDownTime = new Date().getTime();
  function handleMouseDown(e: MouseEvent | TouchEvent) {
    e.preventDefault();

    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    prevClientPoint = { x: clientX, y: clientY };

    if (e instanceof MouseEvent && e.button === 2) {
      setDragMode({ type: "contextMenuScroll" });
      return;
    }

    if (e instanceof MouseEvent && e.button !== 0) return;
    if (contextMenuPoint() != null) return;
    if (dragMode().type !== "none") return;

    const x = viewBox().x + (clientX - svgRect().x) / zoom();
    const y = viewBox().y + (clientY - svgRect().y) / zoom();
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
      case "transition":
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

  function handleDocumentMouseMove(e: MouseEvent | TouchEvent) {
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    const moveX = (clientX - prevClientPoint.x) / zoom();
    const moveY = (clientY - prevClientPoint.y) / zoom();
    prevClientPoint = { x: clientX, y: clientY };

    const x = viewBox().x + (clientX - svgRect().x) / zoom();
    const y = viewBox().y + (clientY - svgRect().y) / zoom();

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
          viewBox().x + (clientX - svgRect().x) / zoom(),
          viewBox().y + (clientY - svgRect().y) / zoom(),
        );
        return;
    }
  }

  function handleDocumentMouseUp(e: MouseEvent | TouchEvent) {
    if (dragMode().type === "contextMenuScroll") {
      const pageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
      const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
      setContextMenuPoint({ x: pageX, y: pageY });
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
        break;
      case "transition":
        setToolbar("transition");
        break;
      case "manualActivity":
        setToolbar("addManualActivity");
        break;
      case "autoActivity":
        setToolbar("addAutoActivity");
        break;
      case "handWork":
        setToolbar("addUserActivity");
        break;
      case "start":
        setToolbar("addStartNode");
        break;
      case "end":
        setToolbar("addEndNode");
        break;
      case "comment":
        setToolbar("addCommentNode");
        break;
    }
  }

  function handleWheel(e: WheelEvent) {
    const newZoom = (zoom() * 100 + (e.deltaY < 0 ? -10 : 10)) / 100;
    changeZoom(newZoom, { x: e.clientX, y: e.clientY });
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
        onMouseDown={handleMouseDown}
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
  readonly onMouseDown?: (e: MouseEvent | TouchEvent) => void;
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
      }
    });
    if (diagramRef) {
      observer.observe(diagramRef);
    }
  });

  let diagramRef: HTMLDivElement | undefined;
  return (
    <div
      class="relative size-full outline-none"
      ref={diagramRef}
      tabindex={-1}
      onKeyDown={(e) => props.onKeyDown?.(e)}
      onContextMenu={(e) => props.onContextMenu?.(e)}
      onWheel={(e) => props.onWheel?.(e)}
      onTouchStart={(e) => props.onMouseDown?.(e)}
      onMouseDown={(e) => props.onMouseDown?.(e)}
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
