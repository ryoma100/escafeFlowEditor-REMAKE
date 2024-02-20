import { JSXElement, Match, Switch, onMount } from "solid-js";
import { useAppContext } from "../../context/app-context";
import { CommentNode, EndNode, StartNode } from "../../data-source/data-type";
import { CommentIcon, EndIcon, StartIcon } from "../icons/material-icons";
import "./other-node.css";

export function OtherNodeContainer(props: { node: CommentNode | StartNode | EndNode }): JSXElement {
  const {
    otherNodeModel: { selectNodes, toggleSelectNode, resizeCommentNode },
    activityModel: { selectActivities },
    diagram: { toolbar, setDragType, setAddingLineFrom },
    dialog: { setOpenCommentDialog },
  } = useAppContext();

  function handleMouseDown(e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          toggleSelectNode(props.node.id);
          setDragType("none");
          e.stopPropagation();
        } else {
          if (!props.node.selected) {
            selectNodes([props.node.id]);
            selectActivities([]);
          }
          setDragType("moveNodes");
        }
        break;
      case "transition":
        selectActivities([]);
        selectNodes([props.node.id]);
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
          case "endNode":
            setDragType("addEndEdge");
            break;
        }
        break;
    }
  }

  function handleDblClick(_e: MouseEvent) {
    if (props.node.type === "commentNode") {
      setOpenCommentDialog(props.node);
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
          <EndNodeView selected={props.node.selected} onMouseDown={handleMouseDown} />
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
}) {
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
      class="comment"
      classList={{
        "comment--selected": props.selected,
      }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
      onDblClick={(e) => props.onDblClick?.(e)}
    >
      <div class="comment__icon">
        <CommentIcon />
      </div>
      <div ref={titleDiv} class="comment__title">
        {props.comment}
      </div>
    </div>
  );
}

export function StartNodeView(props: { selected: boolean; onMouseDown?: (e: MouseEvent) => void }) {
  return (
    <div
      class="start-end"
      classList={{ "start-end--selected": props.selected }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
    >
      <StartIcon />
    </div>
  );
}

export function EndNodeView(props: { selected: boolean; onMouseDown?: (e: MouseEvent) => void }) {
  return (
    <div
      class="start-end"
      classList={{ "start-end--selected": props.selected }}
      onMouseDown={(e) => props.onMouseDown?.(e)}
    >
      <EndIcon />
    </div>
  );
}
