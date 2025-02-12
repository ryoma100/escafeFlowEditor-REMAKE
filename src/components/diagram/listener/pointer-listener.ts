import { makeAddActivityEdgeStrategy } from "@/components/diagram/drag-strategy/add-activity-edge-strategy";
import { makeAddCommentEdgeStrategy } from "@/components/diagram/drag-strategy/add-comment-edge-strategy";
import { makeAddStartEdgeStrategy } from "@/components/diagram/drag-strategy/add-start-edge-strategy";
import { makeDefaultStrategy } from "@/components/diagram/drag-strategy/default-strategy";
import type { DragStrategy } from "@/components/diagram/drag-strategy/drag-strategy-type";
import { makeMoveEndEdgeStrategy } from "@/components/diagram/drag-strategy/move-end-edge-strategy";
import { makeMoveNodesStrategy } from "@/components/diagram/drag-strategy/move-nodes-strategy";
import { makeMoveStartEdgeStrategy } from "@/components/diagram/drag-strategy/move-start-edge-strategy";
import { makeResizeActivityLeftStrategy } from "@/components/diagram/drag-strategy/resize-activity-left-strategy";
import { makeResizeActivityRightStrategy } from "@/components/diagram/drag-strategy/resize-activity-right-strategy";
import { makeRotateNodesStrategy } from "@/components/diagram/drag-strategy/rotate-nodes-strategy";
import { makeScaleNodesStrategy } from "@/components/diagram/drag-strategy/scale-nodes-strategy";
import { makeScrollStrategy } from "@/components/diagram/drag-strategy/scroll-strategy";
import { makeSelectBoxStrategy } from "@/components/diagram/drag-strategy/select-box-strategy";
import { makeSelectCircleStrategy } from "@/components/diagram/drag-strategy/select-circle-strategy";
import { makeSelectStrategy } from "@/components/diagram/drag-strategy/select-strategy";
import { makeMultiTouchListener } from "@/components/diagram/listener/multi-touch-listener";
import type { ToolbarType } from "@/components/toolbar/toolbar";
import type { ActivityNodeModel } from "@/data-model/activity-node-model";
import type { ActorModel } from "@/data-model/actor-model";
import type { DiagramModel } from "@/data-model/diagram-model";
import type { EdgeModel } from "@/data-model/edge-model";
import type { ExtendEdgeModel } from "@/data-model/extend-edge-model";
import type { ExtendNodeModel } from "@/data-model/extend-node-model";
import type { NodeModel } from "@/data-model/node-model";
import type { TransitionEdgeModel } from "@/data-model/transaction-edge-model";
import type { ActivityNode, IEdge, INode, NodeId } from "@/data-source/data-type";
import { containsRect } from "@/utils/rectangle-utils";

export function makePointerListener(
  diagramModel: DiagramModel,
  nodeModel: NodeModel,
  edgeModel: EdgeModel,
  activityNodeModel: ActivityNodeModel,
  transitionEdgeModel: TransitionEdgeModel,
  extendNodeModel: ExtendNodeModel,
  extendEdgeModel: ExtendEdgeModel,
  actorModel: ActorModel,
) {
  const dragStrategies = {
    defaultStrategy: makeDefaultStrategy(),
    resizeActivityLeftStrategy: makeResizeActivityLeftStrategy(diagramModel, activityNodeModel),
    resizeActivityRightStrategy: makeResizeActivityRightStrategy(diagramModel, activityNodeModel),
    scrollStrategy: makeScrollStrategy(diagramModel),
    selectStrategy: makeSelectStrategy(diagramModel, nodeModel, edgeModel),
    selectBoxStrategy: makeSelectBoxStrategy(diagramModel, nodeModel, edgeModel),
    selectCircleStrategy: makeSelectCircleStrategy(diagramModel, nodeModel, edgeModel),
    moveNodesStrategy: makeMoveNodesStrategy(diagramModel, nodeModel, edgeModel),
    rotateNodesStrategy: makeRotateNodesStrategy(diagramModel, nodeModel),
    scaleNodesStrategy: makeScaleNodesStrategy(diagramModel, nodeModel),
    addCommentEdgeStrategy: makeAddCommentEdgeStrategy(diagramModel, nodeModel, extendEdgeModel),
    addStartEdgeStrategy: makeAddStartEdgeStrategy(diagramModel, nodeModel, extendEdgeModel),
    addActivityEdgeStrategy: makeAddActivityEdgeStrategy(
      diagramModel,
      activityNodeModel,
      transitionEdgeModel,
      extendEdgeModel,
    ),
    moveStartEdgeStrategy: makeMoveStartEdgeStrategy(
      diagramModel,
      extendNodeModel,
      transitionEdgeModel,
      extendEdgeModel,
    ),
    moveEndEdgeStrategy: makeMoveEndEdgeStrategy(diagramModel, activityNodeModel, transitionEdgeModel, extendEdgeModel),
  };
  let dragStrategy: DragStrategy = dragStrategies.defaultStrategy;
  const pointerEvents: Map<number, PointerEvent> = new Map();
  let mouseDownTime = new Date().getTime();

  function handleActivityLeftPointerDown(e: PointerEvent, activity: ActivityNode) {
    e.preventDefault(); // Do not call handleDiagramPointerDown
    dragStrategy = dragStrategies.resizeActivityLeftStrategy;
    dragStrategy.handlePointerDown(e, activity);
  }

  function handleActivityRightPointerDown(e: PointerEvent, activity: ActivityNode) {
    e.preventDefault(); // Do not call handleDiagramPointerDown
    dragStrategy = dragStrategies.resizeActivityRightStrategy;
    dragStrategy.handlePointerDown(e, activity);
  }

  function handleActivityPointerDown(e: PointerEvent, activity: ActivityNode) {
    e.preventDefault(); // Do not call handleDiagramPointerDown
    switch (diagramModel.toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          nodeModel.changeSelectNodes("toggle", [activity.id]);
        } else {
          dragStrategy = dragStrategies.moveNodesStrategy;
          dragStrategy.handlePointerDown(e, activity);
        }
        return;
      case "transition":
        dragStrategy = dragStrategies.addActivityEdgeStrategy;
        dragStrategy.handlePointerDown(e, activity);
        return;
      default:
        return;
    }
  }

  function handleExtendNodePointerDown(e: PointerEvent, node: INode) {
    e.preventDefault(); // Do not call handleDiagramPointerDown
    switch (diagramModel.toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          nodeModel.changeSelectNodes("toggle", [node.id]);
        } else {
          dragStrategy = dragStrategies.moveNodesStrategy;
          dragStrategy.handlePointerDown(e, node);
        }
        return;
      case "transition":
        if (node.type === "commentNode") {
          dragStrategy = dragStrategies.addCommentEdgeStrategy;
          dragStrategy.handlePointerDown(e, node);
        } else if (node.type === "startNode") {
          dragStrategy = dragStrategies.addStartEdgeStrategy;
          dragStrategy.handlePointerDown(e, node);
        }
        return;
      default:
        return;
    }
  }

  function handleMoveStartEdgePointerDown(e: PointerEvent, edge: IEdge, endNodeId: NodeId) {
    e.preventDefault(); // Do not call handleDiagramPointerDown
    const endNode = nodeModel.nodeList.find((it) => it.id === endNodeId);
    if (endNode) {
      dragStrategy = dragStrategies.moveStartEdgeStrategy;
      dragStrategy.handlePointerDown(e, endNode, edge);
    }
  }

  function handleMoveEndEdgePointerDown(e: PointerEvent, edge: IEdge, startNodeId: NodeId) {
    e.preventDefault(); // Do not call handleDiagramPointerDown
    const startNode = nodeModel.nodeList.find((it) => it.id === startNodeId);
    if (startNode) {
      dragStrategy = dragStrategies.moveEndEdgeStrategy;
      dragStrategy.handlePointerDown(e, startNode, edge);
    }
  }

  function handleDiagramPointerDown(e: PointerEvent) {
    pointerEvents.set(e.pointerId, e);
    if (pointerEvents.size > 1) return;

    if (e.pointerType === "mouse") {
      if (e.button === 2) {
        dragStrategy = dragStrategies.scrollStrategy;
        dragStrategy.handlePointerDown(e);
        return;
      }
      if (e.button !== 0) {
        return;
      }
    }

    switch (diagramModel.toolbar()) {
      case "cursor":
        {
          if (mouseDownTime + 250 > new Date().getTime()) {
            // onDoubleMouseDown
            if (e.ctrlKey || e.metaKey) {
              dragStrategy = dragStrategies.rotateNodesStrategy;
              dragStrategy.handlePointerDown(e);
            } else if (e.shiftKey) {
              dragStrategy = dragStrategies.scaleNodesStrategy;
              dragStrategy.handlePointerDown(e);
            } else {
              dragStrategy = dragStrategies.scrollStrategy;
              dragStrategy.handlePointerDown(e);
            }
          } else {
            // onSingleMouseDown
            mouseDownTime = new Date().getTime();
            if (e.ctrlKey || e.metaKey) {
              dragStrategy = dragStrategies.selectCircleStrategy;
              dragStrategy.handlePointerDown(e);
            } else if (e.shiftKey) {
              dragStrategy = dragStrategies.selectBoxStrategy;
              dragStrategy.handlePointerDown(e);
            } else {
              dragStrategy = dragStrategies.selectStrategy;
              dragStrategy.handlePointerDown(e);
            }

            setTimeout(() => {
              if (dragStrategy == null) {
                nodeModel.setNodeList(() => true, "selected", false);
                edgeModel.setEdgeList(() => true, "selected", false);
              }
            }, 250);
          }
        }
        return;
      case "addManualActivity":
      case "addAutoActivity":
      case "addUserActivity":
      case "addCommentNode":
      case "addStartNode":
      case "addEndNode":
        {
          const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);
          if (nodeModel.nodeList.every((it) => !containsRect(it, { x, y }))) {
            const node = addNode(diagramModel.toolbar(), x, y);
            dragStrategy = dragStrategies.moveNodesStrategy;
            dragStrategy.handlePointerDown(e, node);
          }
        }
        return;
      default:
        return;
    }
  }

  function addNode(type: ToolbarType, x: number, y: number): INode {
    switch (type) {
      case "addManualActivity":
        return activityNodeModel.addActivity("manualActivity", actorModel.selectedActor().id, x, y);
      case "addAutoActivity":
        return activityNodeModel.addActivity("autoActivity", actorModel.selectedActor().id, x, y);
      case "addUserActivity":
        return activityNodeModel.addActivity("userActivity", actorModel.selectedActor().id, x, y);
      case "addCommentNode":
        return extendNodeModel.addCommentNode(x, y);
      case "addStartNode":
        return extendNodeModel.addStartNode(x, y);
      case "addEndNode":
        return extendNodeModel.addEndNode(x, y);
      default:
        throw new Error(`${type} is not excepted`);
    }
  }

  function handleDocumentPointerMove(e: PointerEvent) {
    if (pointerEvents.size === 1) {
      dragStrategy.handlePointerMove(e, pointerEvents);
    } else if (pointerEvents.size === 2) {
      makeMultiTouchListener(diagramModel).handlePointerMove(e, pointerEvents);
    }
    pointerEvents.set(e.pointerId, e);
  }

  function handleDocumentPointerUp(e: PointerEvent) {
    if (pointerEvents.size <= 1) {
      dragStrategy.handlePointerUp(e);
      dragStrategy = dragStrategies.defaultStrategy;
    }
    pointerEvents.delete(e.pointerId);
  }

  return {
    handleActivityLeftPointerDown,
    handleActivityRightPointerDown,
    handleActivityPointerDown,
    handleExtendNodePointerDown,
    handleMoveStartEdgePointerDown,
    handleMoveEndEdgePointerDown,
    handleDiagramPointerDown,
    handleDocumentPointerMove,
    handleDocumentPointerUp,
  };
}
