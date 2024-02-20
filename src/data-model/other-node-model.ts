import { createStore, produce } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { CommentNode, EndNode, ProcessEntity, StartNode } from "../data-source/data-type";

export function makeOtherNodeModel() {
  let process: ProcessEntity;
  const [otherNodeList, setOtherNodeList] = createStore<(CommentNode | StartNode | EndNode)[]>([]);

  function load(newProcess: ProcessEntity) {
    process = newProcess;
    setOtherNodeList(process.otherNodes);
  }

  function save() {
    process.otherNodes = [...otherNodeList];
  }

  function addCommentNode(x: number, y: number): CommentNode {
    const comment = dataFactory.createComment(process, x - 16, y - 16);
    setOtherNodeList([...otherNodeList, comment]);
    return comment;
  }

  function addStartNode(x: number, y: number): StartNode {
    const node = dataFactory.createStartNode(process, x - 16, y - 16);
    setOtherNodeList([...otherNodeList, node]);
    return node;
  }

  function addEndNode(x: number, y: number): EndNode {
    const node = dataFactory.createEndNode(process, x - 16, y - 16);
    setOtherNodeList([...otherNodeList, node]);
    return node;
  }

  function resizeCommentNode(node: CommentNode, width: number, height: number) {
    setOtherNodeList(
      (it) => it.id === node.id,
      produce((it) => {
        it.width = width;
        it.height = height;
      }),
    );
  }

  function moveSelectedNodes(moveX: number, moveY: number) {
    setOtherNodeList(
      (it) => it.selected,
      produce((it) => {
        it.x += moveX;
        it.y += moveY;
      }),
    );
  }

  function selectNodes(ids: number[]) {
    setOtherNodeList(
      () => true,
      produce((it) => {
        const selected = ids.includes(it.id);
        if (it.selected !== selected) {
          it.selected = selected;
        }
      }),
    );
  }

  function toggleSelectNode(id: number) {
    setOtherNodeList(
      (it) => it.id === id,
      produce((it) => {
        it.selected = !it.selected;
      }),
    );
  }

  function updateComment(node: CommentNode) {
    setOtherNodeList(
      (it) => it.id === node.id,
      produce((it) => {
        (it as CommentNode).comment = node.comment;
      }),
    );
  }

  return {
    load,
    save,
    otherNodeList,
    addCommentNode,
    addStartNode,
    addEndNode,
    resizeCommentNode,
    moveSelectedNodes,
    selectNodes,
    toggleSelectNode,
    updateComment,
  };
}
