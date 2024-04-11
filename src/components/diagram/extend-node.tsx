import { JSXElement, Match, Switch, onMount } from "solid-js";

import CommentSvg from "@/assets/material-icons/comment-node.svg";
import EndSvg from "@/assets/material-icons/end-node.svg";
import StartSvg from "@/assets/material-icons/start-node.svg";
import { useAppContext } from "@/context/app-context";
import { CommentNode, EndNode, StartNode } from "@/data-source/data-type";

export function ExtendNodeContainer(props: {
  node: CommentNode | StartNode | EndNode;
}): JSXElement {
  const {
    extendNodeModel: { resizeCommentNode },
    extendEdgeModel: { addEndEdge },
    nodeModel: { changeSelectNodes },
    diagramModel: { toolbar, dragMode: dragType, setDragMode: setDragType, setAddingLineFrom },
    dialog: { setModalDialog: setOpenDialog },
  } = useAppContext();

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
  comment: string;
  selected: boolean;
  onMouseDown?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
  onChangeSize?: (width: number, height: number) => void;
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
      class="
        flex flex-row
        rounded bg-background
        hover:cursor-move hover:bg-primary3"
      classList={{
        "p-px border border-gray-500": !props.selected,
        "p-0 border-2 border-primary1": props.selected,
      }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
      onDblClick={(e) => props.onDblClick?.(e)}
    >
      <div class="m-1 flex items-center">
        <CommentSvg />
      </div>
      <div ref={titleDiv} class="whitespace-pre p-1 text-[11px] leading-[1.1]">
        {props.comment}
      </div>
    </div>
  );
}

export function StartNodeView(props: { selected: boolean; onMouseDown?: (e: MouseEvent) => void }) {
  return (
    <div
      class="
        flex h-10 w-10 items-center
        justify-center 
        rounded bg-background
        hover:cursor-move hover:bg-primary3"
      classList={{
        "border border-gray-500": !props.selected,
        "border-2 border-primary1": props.selected,
      }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
    >
      <StartSvg />
    </div>
  );
}

export function EndNodeView(props: {
  selected: boolean;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
}) {
  return (
    <div
      class="
        flex h-10 w-10 items-center
        justify-center 
        rounded bg-background
        hover:cursor-move hover:bg-primary3"
      classList={{
        "border border-gray-500": !props.selected,
        "border-2 border-primary1": props.selected,
      }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
      onMouseUp={(e) => props.onMouseUp?.(e)}
    >
      <EndSvg />
    </div>
  );
}
