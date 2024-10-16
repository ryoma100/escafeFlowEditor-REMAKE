import { JSXElement, Match, onMount, Switch } from "solid-js";

import { useModelContext } from "@/context/model-context";
import { CommentNode, EndNode, StartNode } from "@/data-source/data-type";
import { CommentIcon } from "@/icons/comment";
import { EndIcon } from "@/icons/end-icon";
import { StartIcon } from "@/icons/start-icon";

export function ExtendNodeContainer(props: {
  readonly node: CommentNode | StartNode | EndNode;
}): JSXElement {
  const {
    extendNodeModel: { resizeCommentNode },
    nodeModel: { changeSelectNodes },
    diagramModel: { toolbar, setDragMode, setAddingLineFrom },
    dialogModel: { setModalDialog: setOpenDialog },
  } = useModelContext();

  function handlePointerDown(e: PointerEvent) {
    e.preventDefault();

    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          changeSelectNodes("toggle", [props.node.id]);
          setDragMode({ type: "none" });
          e.stopPropagation();
        } else {
          if (!props.node.selected) {
            changeSelectNodes("select", [props.node.id]);
          }
          setDragMode({ type: "moveNodes" });
        }
        return;
      case "transition":
        changeSelectNodes("select", [props.node.id]);
        setAddingLineFrom(
          props.node.x + props.node.width / 2,
          props.node.y + props.node.height / 2,
        );
        if (props.node.type === "commentNode") {
          setDragMode({ type: "addCommentEdge", fromComment: props.node });
        } else if (props.node.type === "startNode") {
          setDragMode({ type: "addStartEdge", fromStart: props.node });
        }
        return;
    }
  }

  function handleDblClick(_e: MouseEvent) {
    if (props.node.type === "commentNode") {
      setOpenDialog({ type: "comment", comment: props.node });
    }
  }

  return (
    <foreignObject
      x={props.node.x}
      y={props.node.y}
      width={props.node.width}
      height={props.node.height}
    >
      <Switch>
        <Match when={props.node.type === "commentNode"}>
          <CommentNodeView
            comment={(props.node as CommentNode).comment}
            selected={props.node.selected}
            onPointerDown={handlePointerDown}
            onDblClick={handleDblClick}
            onChangeSize={(w, h) => resizeCommentNode(props.node as CommentNode, w, h)}
          />
        </Match>
        <Match when={props.node.type === "startNode"}>
          <StartNodeView selected={props.node.selected} onPointerDown={handlePointerDown} />
        </Match>
        <Match when={props.node.type === "endNode"}>
          <EndNodeView selected={props.node.selected} onPointerDown={handlePointerDown} />
        </Match>
      </Switch>
    </foreignObject>
  );
}

export function CommentNodeView(props: {
  readonly comment: string;
  readonly selected: boolean;
  readonly onPointerDown?: (e: PointerEvent) => void;
  readonly onDblClick?: (e: MouseEvent) => void;
  readonly onChangeSize?: (width: number, height: number) => void;
}): JSXElement {
  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (titleDiv) {
        const width = titleDiv.clientWidth + 36;
        const height = titleDiv.clientHeight + 4;
        props.onChangeSize?.(width, height);
      }
    });
    if (titleDiv) {
      observer.observe(titleDiv);
    }
  });

  let titleDiv: HTMLDivElement | undefined;
  return (
    <div
      class="flex flex-row rounded bg-background hover:cursor-move hover:bg-secondary"
      classList={{
        "p-px border [border-color:var(--foreground-color)]": !props.selected,
        "p-0 border-2 border-primary": props.selected,
      }}
      onPointerDown={(e) => props.onPointerDown?.(e)}
      onDblClick={(e) => props.onDblClick?.(e)}
    >
      <div class="m-1 flex items-center">
        <CommentIcon class="[fill:var(--foreground-color)]" />
      </div>
      <div
        ref={titleDiv}
        class="whitespace-pre p-1 text-[11px] leading-[1.1] [color:var(--foreground-color)]"
      >
        {props.comment}
      </div>
    </div>
  );
}

export function StartNodeView(props: {
  readonly selected: boolean;
  readonly onPointerDown?: (e: PointerEvent) => void;
}) {
  return (
    <div
      class="flex size-10 items-center justify-center rounded bg-background hover:cursor-move hover:bg-secondary"
      classList={{
        "border [border-color:var(--foreground-color)]": !props.selected,
        "border-2 border-primary": props.selected,
      }}
      onPointerDown={(e) => props.onPointerDown?.(e)}
    >
      <StartIcon class="[fill:var(--foreground-color)]" />
    </div>
  );
}

export function EndNodeView(props: {
  readonly selected: boolean;
  readonly onPointerDown?: (e: PointerEvent) => void;
  readonly onPointerUp?: (e: PointerEvent) => void;
}) {
  return (
    <div
      class="flex size-10 items-center justify-center rounded bg-background hover:cursor-move hover:bg-secondary"
      classList={{
        "border [border-color:var(--foreground-color)]": !props.selected,
        "border-2 border-primary": props.selected,
      }}
      onPointerDown={(e) => props.onPointerDown?.(e)}
      onPointerUp={(e) => props.onPointerUp?.(e)}
    >
      <EndIcon class="[fill:var(--foreground-color)]" />
    </div>
  );
}
