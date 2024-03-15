import { produce } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { CommentNode, EndNode, StartNode } from "../data-source/data-type";
import { makeNodeModel } from "./node-model";

export function makeExtendNodeModel(nodeModel: ReturnType<typeof makeNodeModel>) {
  function addCommentNode(x: number, y: number): CommentNode {
    const comment = dataFactory.createCommentNode(nodeModel.nodeList, x - 16, y - 16);
    nodeModel.addNode(comment);
    return comment;
  }

  function getCommentNode(nodeId: number): CommentNode {
    const node = nodeModel.getNode(nodeId);
    if (node.type !== "commentNode") {
      throw new Error(`getCommentNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function addStartNode(x: number, y: number): StartNode {
    const node = dataFactory.createStartNode(nodeModel.nodeList, x - 16, y - 16);
    nodeModel.addNode(node);
    return node;
  }

  function getStartNode(nodeId: number): StartNode {
    const node = nodeModel.getNode(nodeId);
    if (node.type !== "startNode") {
      throw new Error(`getStartNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function addEndNode(x: number, y: number): EndNode {
    const node = dataFactory.createEndNode(nodeModel.nodeList, x - 16, y - 16);
    nodeModel.addNode(node);
    return node;
  }

  function getEndNode(nodeId: number): EndNode {
    const node = nodeModel.getNode(nodeId);
    if (node.type !== "endNode") {
      throw new Error(`getEndNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function resizeCommentNode(node: CommentNode, width: number, height: number) {
    nodeModel.setNodeList(
      (it) => it.id === node.id,
      produce((it) => {
        it.width = width;
        it.height = height;
      }),
    );
  }

  function updateComment(node: CommentNode) {
    nodeModel.setNodeList(
      (it) => it.id === node.id,
      produce((it) => {
        if (it.type === "commentNode") {
          it.comment = node.comment;
        }
      }),
    );
  }

  return {
    addCommentNode,
    addStartNode,
    addEndNode,
    resizeCommentNode,
    updateComment,
    getCommentNode,
    getStartNode,
    getEndNode,
  };
}
