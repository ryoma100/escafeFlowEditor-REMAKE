import { JSXElement, Match, Switch, onMount } from "solid-js";

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
    extendEdgeModel: { addEndEdge },
    nodeModel: { changeSelectNodes },
    diagramModel: { toolbar, dragMode: dragType, setDragMode: setDragType, setAddingLineFrom },
    dialogModel: { setModalDialog: setOpenDialog },
  } = useModelContext();

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();

    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          changeSelectNodes("toggle", [props.node.id]);
          setDragType({ type: "none" });
          e.stopPropagation();
        } else {
          if (!props.node.selected) {
            changeSelectNodes("select", [props.node.id]);
          }
          setDragType({ type: "moveNodes" });
        }
        break;
      case "transition":
        changeSelectNodes("select", [props.node.id]);
        setAddingLineFrom(
          props.node.x + props.node.width / 2,
          props.node.y + props.node.height / 2,
        );
        switch (props.node.type) {
          case "commentNode":
            setDragType({ type: "addCommentEdge", fromComment: props.node });
            break;
          case "startNode":
            setDragType({ type: "addStartEdge", fromStart: props.node });
            break;
        }
        break;
    }
  }

  function handleMouseUp(_e: MouseEvent) {
    switch (dragType().type) {
      case "addTransition":
        addEndEdge(props.node.id);
        setDragType({ type: "none" });
        break;
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
            onMouseDown={handleMouseDown}
            onDblClick={handleDblClick}
            onChangeSize={(w, h) => resizeCommentNode(props.node as CommentNode, w, h)}
          />
        </Match>
        <Match when={props.node.type === "startNode"}>
          <StartNodeView selected={props.node.selected} onMouseDown={handleMouseDown} />
        </Match>
        <Match when={props.node.type === "endNode"}>
          <EndNodeView
            selected={props.node.selected}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
        </Match>
      </Switch>
    </foreignObject>
  );
}

export function CommentNodeView(props: {
  readonly comment: string;
  readonly selected: boolean;
  readonly onMouseDown?: (e: MouseEvent) => void;
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
      class="flex flex-row rounded bg-background hover:cursor-move hover:bg-primary3"
      classList={{
        "p-px border border-gray-500": !props.selected,
        "p-0 border-2 border-primary1": props.selected,
      }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
      onDblClick={(e) => props.onDblClick?.(e)}
    >
      <div class="m-1 flex items-center">
        <CommentIcon />
      </div>
      <div ref={titleDiv} class="whitespace-pre p-1 text-[11px] leading-[1.1]">
        {props.comment}
      </div>
    </div>
  );
}

export function StartNodeView(props: {
  readonly selected: boolean;
  readonly onMouseDown?: (e: MouseEvent) => void;
}) {
  return (
    <div
      class="flex size-10 items-center justify-center rounded bg-background hover:cursor-move hover:bg-primary3"
      classList={{
        "border border-gray-500": !props.selected,
        "border-2 border-primary1": props.selected,
      }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
    >
      <StartIcon />
    </div>
  );
}

export function EndNodeView(props: {
  readonly selected: boolean;
  readonly onMouseDown?: (e: MouseEvent) => void;
  readonly onMouseUp?: (e: MouseEvent) => void;
}) {
  return (
    <div
      class="flex size-10 items-center justify-center rounded bg-background hover:cursor-move hover:bg-primary3"
      classList={{
        "border border-gray-500": !props.selected,
        "border-2 border-primary1": props.selected,
      }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
      onMouseUp={(e) => props.onMouseUp?.(e)}
    >
      <EndIcon />
    </div>
  );
}
