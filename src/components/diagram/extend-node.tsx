import { JSXElement, Match, Switch, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { CommentNode, EndNode, StartNode } from "../../data-source/data-type";
import { CommentIcon, EndIcon, StartIcon } from "../icons/material-icons";

export function ExtendNodeContainer(props: {
  node: CommentNode | StartNode | EndNode;
}): JSXElement {
  const {
    extendNodeModel: { resizeCommentNode },
    extendEdgeModel: { addEndEdge },
    nodeModel: { changeSelectNodes },
    diagram: { toolbar, dragType, setDragType, setAddingLineFrom },
    dialog: { setOpenDialog },
  } = useAppContext();

  function handleMouseDown(e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          changeSelectNodes("toggle", [props.node.id]);
          setDragType("none");
          e.stopPropagation();
        } else {
          if (!props.node.selected) {
            changeSelectNodes("select", [props.node.id]);
          }
          setDragType("moveNodes");
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
            setDragType("addCommentEdge");
            break;
          case "startNode":
            setDragType("addStartEdge");
            break;
        }
        break;
    }
  }

  function handleMouseUp(_e: MouseEvent) {
    switch (dragType()) {
      case "addTransition":
        addEndEdge(props.node.id);
        setDragType("none");
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
        const width = titleDiv.clientWidth + 48;
        const height = titleDiv.clientHeight + 8;
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
      data-select={props.selected}
      class="
        m-px flex flex-row border border-solid
        border-gray-500 bg-background p-0.5
        hover:cursor-move hover:bg-primary3
        data-[select=true]:m-0 data-[select=true]:border-2 data-[select=true]:border-solid data-[select=true]:border-primary1"
      onMouseDown={(e) => props.onMouseDown?.(e)}
      onDblClick={(e) => props.onDblClick?.(e)}
    >
      <div class="flex items-center">
        <CommentIcon />
      </div>
      <div ref={titleDiv} class="whitespace-pre text-[11px] leading-[1.1]">
        {props.comment}
      </div>
    </div>
  );
}

export function StartNodeView(props: { selected: boolean; onMouseDown?: (e: MouseEvent) => void }) {
  return (
    <div
      data-select={props.selected}
      class="
        m-px rounded border border-solid border-gray-500 bg-background p-0.5
        hover:cursor-move hover:bg-primary3
        data-[select=true]:m-0 data-[select=true]:border-2 data-[select=true]:border-solid data-[select=true]:border-primary1"
      onMouseDown={(e) => props.onMouseDown?.(e)}
    >
      <StartIcon />
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
      data-select={props.selected}
      class="
        m-px rounded border border-solid border-gray-500 bg-background p-0.5
        hover:cursor-move hover:bg-primary3
        data-[select=true]:m-0 data-[select=true]:border-2 data-[select=true]:border-solid data-[select=true]:border-primary1"
      onMouseDown={(e) => props.onMouseDown?.(e)}
      onMouseUp={(e) => props.onMouseUp?.(e)}
    >
      <EndIcon />
    </div>
  );
}
