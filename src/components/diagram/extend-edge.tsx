import { JSXElement } from "solid-js";

import { useModelContext } from "@/context/model-context";
import { CommentEdge, EndEdge, Line, NodeId, StartEdge } from "@/data-source/data-type";
import { computeLine, extendLine } from "@/utils/line-utils";

export function ExtendEdgeContainer(props: {
  readonly edge: CommentEdge | StartEdge | EndEdge;
  readonly onFromPointerDown: (e: PointerEvent, endNodeId: NodeId) => void;
  readonly onToPointerDown: (e: PointerEvent, startNodeId: NodeId) => void;
}): JSXElement {
  const { nodeModel, edgeModel } = useModelContext();

  const fromRect = () => nodeModel.getNode(props.edge.fromNodeId);
  const toRect = () => nodeModel.getNode(props.edge.toNodeId);
  const line = () =>
    computeLine(fromRect(), toRect(), {
      p1: {
        x: fromRect().x + fromRect().width / 2,
        y: fromRect().y + fromRect().height / 2,
      },
      p2: {
        x: toRect().x + toRect().width / 2,
        y: toRect().y + toRect().height / 2,
      },
    });

  function handlePointerDown(e: PointerEvent) {
    e.stopPropagation();

    if (e.shiftKey) {
      edgeModel.changeSelectEdges("toggle", [props.edge.id]);
    } else if (!props.edge.selected) {
      edgeModel.changeSelectEdges("select", [props.edge.id]);
      nodeModel.changeSelectNodes("clearAll");
    }
  }

  function handleFromPointerDown(e: PointerEvent) {
    props.onFromPointerDown(e, props.edge.toNodeId);
  }

  function handleToPointerDown(e: PointerEvent) {
    props.onToPointerDown(e, props.edge.fromNodeId);
  }

  return (
    <OtherEdgeView
      line={line()}
      selected={props.edge.selected}
      disabled={props.edge.disabled}
      onPointerDown={handlePointerDown}
      onFromPointerDown={handleFromPointerDown}
      onToPointerDown={handleToPointerDown}
    />
  );
}

export function OtherEdgeView(props: {
  readonly line: Line;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly onPointerDown?: (e: PointerEvent) => void;
  readonly onFromPointerDown?: (e: PointerEvent) => void;
  readonly onToPointerDown?: (e: PointerEvent) => void;
}): JSXElement {
  const connectors = () => extendLine(props.line, -5);

  return (
    <>
      <line
        class="stroke fill-none [vector-effect:non-scaling-stroke]"
        classList={{
          "[stroke:var(--foreground-color)]": !props.disabled,
          "[stroke:var(--gridline-color)]": props.disabled,
        }}
        x1={props.line.p1.x}
        y1={props.line.p1.y}
        x2={props.line.p2.x}
        y2={props.line.p2.y}
      />
      <line
        class="fill-none stroke-5 hover:cursor-pointer hover:stroke-primary"
        classList={{
          "stroke-transparent": !props.selected,
          "stroke-primary": props.selected,
        }}
        onPointerDown={(e) => props.onPointerDown?.(e)}
        x1={props.line.p1.x}
        y1={props.line.p1.y}
        x2={props.line.p2.x}
        y2={props.line.p2.y}
      />
      <circle
        class="fill-none stroke-transparent hover:cursor-pointer hover:fill-primary"
        onPointerDown={(e) => props.onFromPointerDown?.(e)}
        cx={connectors().p1.x}
        cy={connectors().p1.y}
        r={10}
      />
      <circle
        class="fill-none stroke-transparent hover:cursor-pointer hover:fill-primary"
        onPointerDown={(e) => props.onToPointerDown?.(e)}
        cx={connectors().p2.x}
        cy={connectors().p2.y}
        r={10}
      />
    </>
  );
}
