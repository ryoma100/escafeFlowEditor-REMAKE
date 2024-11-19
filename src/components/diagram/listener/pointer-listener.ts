import { makeAddActivityEdgeStrategy } from "@/components/diagram/drag-strategy/add-activity-edge-strategy";
import { makeAddCommentEdgeStrategy } from "@/components/diagram/drag-strategy/add-comment-edge-strategy";
import { makeAddStartEdgeStrategy } from "@/components/diagram/drag-strategy/add-start-edge-strategy";
import { makeMoveNodesStrategy } from "@/components/diagram/drag-strategy/move-nodes-strategy";
import { makePointStrategy } from "@/components/diagram/drag-strategy/point-strategy";
import { makeResizeActivityLeftStrategy } from "@/components/diagram/drag-strategy/resize-activity-left-strategy";
import { makeResizeActivityRightStrategy } from "@/components/diagram/drag-strategy/resize-activity-right-strategy";
import { makeRotateNodesStrategy } from "@/components/diagram/drag-strategy/rotate-nodes-strategy";
import { makeScaleNodesStrategy } from "@/components/diagram/drag-strategy/scale-nodes-strategy";
import { makeScrollStrategy } from "@/components/diagram/drag-strategy/scroll-strategy";
import { makeSelectBoxStrategy } from "@/components/diagram/drag-strategy/select-box-strategy";
import { makeSelectCircleStrategy } from "@/components/diagram/drag-strategy/select-circle-strategy";
import { makeSelectStrategy } from "@/components/diagram/drag-strategy/select-strategy";
import { makeMultiTouchListener } from "@/components/diagram/listener/multi-touch-listener";
import { ToolbarType } from "@/components/toolbar/toolbar";
import { ActivityNodeModel } from "@/data-model/activity-node-model";
import { ActorModel } from "@/data-model/actor-model";
import { DiagramModel } from "@/data-model/diagram-model";
import { EdgeModel } from "@/data-model/edge-model";
import { ExtendEdgeModel } from "@/data-model/extend-edge-model";
import { ExtendNodeModel } from "@/data-model/extend-node-model";
import { NodeModel } from "@/data-model/node-model";
import { TransitionEdgeModel } from "@/data-model/transaction-edge-model";
import { ActivityNode, INode } from "@/data-source/data-type";
import { containsRect } from "@/utils/rectangle-utils";

export type PointerStrategy = {
  handlePointerDown(e: PointerEvent, node?: INode): void;
  handlePointerMove(e: PointerEvent, pointerEvents: Map<number, PointerEvent>): void;
  handlePointerUp(e: PointerEvent): void;
};

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
  const strategies = {
    pointStrategy: makePointStrategy(),
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
  };
  let pointerStrategy: PointerStrategy = strategies.pointStrategy;
  const pointerEvents: Map<number, PointerEvent> = new Map();
  let mouseDownTime = new Date().getTime();

  function handleActivityLeftPointerDown(e: PointerEvent, activity: ActivityNode) {
    e.preventDefault(); // Do not call handleDiagramPointerDown
    pointerStrategy = strategies.resizeActivityLeftStrategy;
    pointerStrategy.handlePointerDown(e, activity);
  }

  function handleActivityRightPointerDown(e: PointerEvent, activity: ActivityNode) {
    e.preventDefault(); // Do not call handleDiagramPointerDown
    pointerStrategy = strategies.resizeActivityRightStrategy;
    pointerStrategy.handlePointerDown(e, activity);
  }

  function handleActivityPointerDown(e: PointerEvent, activity: ActivityNode) {
    e.preventDefault(); // Do not call handleDiagramPointerDown
    switch (diagramModel.toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          nodeModel.changeSelectNodes("toggle", [activity.id]);
        } else {
          pointerStrategy = strategies.moveNodesStrategy;
          pointerStrategy.handlePointerDown(e, activity);
        }
        return;
      case "transition":
        pointerStrategy = strategies.addActivityEdgeStrategy;
        pointerStrategy.handlePointerDown(e, activity);
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
          pointerStrategy = strategies.moveNodesStrategy;
          pointerStrategy.handlePointerDown(e, node);
        }
        return;
      case "transition":
        if (node.type === "commentNode") {
          pointerStrategy = strategies.addCommentEdgeStrategy;
          pointerStrategy.handlePointerDown(e, node);
        } else if (node.type === "startNode") {
          pointerStrategy = strategies.addStartEdgeStrategy;
          pointerStrategy.handlePointerDown(e, node);
        }
        return;
    }
  }

  function handleDiagramPointerDown(e: PointerEvent) {
    pointerEvents.set(e.pointerId, e);
    if (pointerEvents.size > 1) return;

    if (e.pointerType === "mouse") {
      if (e.button === 2) {
        pointerStrategy = strategies.scrollStrategy;
        pointerStrategy.handlePointerDown(e);
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
              pointerStrategy = strategies.rotateNodesStrategy;
              pointerStrategy.handlePointerDown(e);
            } else if (e.shiftKey) {
              pointerStrategy = strategies.scaleNodesStrategy;
              pointerStrategy.handlePointerDown(e);
            } else {
              pointerStrategy = strategies.scrollStrategy;
              pointerStrategy.handlePointerDown(e);
            }
          } else {
            // onSingleMouseDown
            mouseDownTime = new Date().getTime();
            if (e.ctrlKey || e.metaKey) {
              pointerStrategy = strategies.selectCircleStrategy;
              pointerStrategy.handlePointerDown(e);
            } else if (e.shiftKey) {
              pointerStrategy = strategies.selectBoxStrategy;
              pointerStrategy.handlePointerDown(e);
            } else {
              pointerStrategy = strategies.selectStrategy;
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
      case "addAutoActivity":
      case "addUserActivity":
      case "addCommentNode":
      case "addStartNode":
      case "addEndNode":
        {
          const { x, y } = diagramModel.normalizePoint(e.clientX, e.clientY);
          if (nodeModel.nodeList.every((it) => !containsRect(it, { x, y }))) {
            const node = addNode(diagramModel.toolbar(), x, y);
            pointerStrategy = strategies.moveNodesStrategy;
            pointerStrategy.handlePointerDown(e, node);
          }
        }
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
      pointerStrategy.handlePointerMove(e, pointerEvents);
    } else if (pointerEvents.size === 2) {
      makeMultiTouchListener(diagramModel).handlePointerMove(e, pointerEvents);
    }
    pointerEvents.set(e.pointerId, e);
  }

  function handleDocumentPointerUp(e: PointerEvent) {
    if (pointerEvents.size === 1) {
      pointerStrategy.handlePointerUp(e);
      pointerStrategy = strategies.pointStrategy;
    }
    pointerEvents.delete(e.pointerId);
  }

  return {
    handleActivityLeftPointerDown,
    handleActivityRightPointerDown,
    handleActivityPointerDown,
    handleExtendNodePointerDown,
    handleDiagramPointerDown,
    handleDocumentPointerMove,
    handleDocumentPointerUp,
  };
}
