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

  function getCommentNode(nodeId: number): CommentNode {
    const node = otherNodeList.find((it) => it.id === nodeId);
    if (node?.type !== "commentNode") {
      throw new Error(`getCommentNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function addStartNode(x: number, y: number): StartNode {
    const node = dataFactory.createStartNode(process, x - 16, y - 16);
    setOtherNodeList([...otherNodeList, node]);
    return node;
  }

  function getStartNode(nodeId: number): StartNode {
    const node = otherNodeList.find((it) => it.id === nodeId);
    if (node?.type !== "startNode") {
      throw new Error(`getStartNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function addEndNode(x: number, y: number): EndNode {
    const node = dataFactory.createEndNode(process, x - 16, y - 16);
    setOtherNodeList([...otherNodeList, node]);
    return node;
  }

  function getEndNode(nodeId: number): EndNode {
    const node = otherNodeList.find((it) => it.id === nodeId);
    if (node?.type !== "endNode") {
      throw new Error(`getEndNode(${nodeId}) is not found.`);
    }
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
    updateComment,
    getCommentNode,
    getStartNode,
    getEndNode,
    setOtherNodeList,
  };
}
