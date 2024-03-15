import { produce } from "solid-js/store";
import { dataFactory } from "../data-source/data-factory";
import { CommentNode, EndNode, StartNode } from "../data-source/data-type";
import { BaseNodeModel } from "./base-node-model";

export type ExtendNodeModel = ReturnType<typeof makeExtendNodeModel>;

export function makeExtendNodeModel(baseNodeModel: BaseNodeModel) {
  function addCommentNode(x: number, y: number): CommentNode {
    const nextId = baseNodeModel.computeNextId();
    const comment = dataFactory.createComment(nextId, x - 16, y - 16);
    baseNodeModel.addNode(comment);
    return comment;
  }

  function getCommentNode(nodeId: number): CommentNode {
    const node = baseNodeModel.getNode(nodeId);
    if (node.type !== "commentNode") {
      throw new Error(`getCommentNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function addStartNode(x: number, y: number): StartNode {
    const nextId = baseNodeModel.computeNextId();
    const node = dataFactory.createStartNode(nextId, x - 16, y - 16);
    baseNodeModel.addNode(node);
    return node;
  }

  function getStartNode(nodeId: number): StartNode {
    const node = baseNodeModel.getNode(nodeId);
    if (node.type !== "startNode") {
      throw new Error(`getStartNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function addEndNode(x: number, y: number): EndNode {
    const nextId = baseNodeModel.computeNextId();
    const node = dataFactory.createEndNode(nextId, x - 16, y - 16);
    baseNodeModel.addNode(node);
    return node;
  }

  function getEndNode(nodeId: number): EndNode {
    const node = baseNodeModel.getNode(nodeId);
    if (node.type !== "endNode") {
      throw new Error(`getEndNode(${nodeId}) is not found.`);
    }
    return node;
  }

  function resizeCommentNode(node: CommentNode, width: number, height: number) {
    baseNodeModel.setNodeList(
      (it) => it.id === node.id,
      produce((it) => {
        it.width = width;
        it.height = height;
      }),
    );
  }

  function updateComment(node: CommentNode) {
    baseNodeModel.setNodeList(
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
