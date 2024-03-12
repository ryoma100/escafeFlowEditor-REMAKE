import { ACTIVITY_MIN_WIDTH, NORMAL_ICON_SIZE } from "../constants/app-const";
import {
  ActivityNode,
  ActivityNodeType,
  ActorEntity,
  CommentEdge,
  CommentNode,
  EndEdge,
  EndNode,
  ProcessDetailEntity,
  ProcessEntity,
  ProjectEntity,
  StartEdge,
  StartNode,
  TransitionEdge,
} from "./data-type";

function createProject(): ProjectEntity {
  const project: ProjectEntity = {
    xpdlId: "newpkg",
    name: "パッケージ",
    created: new Date().toISOString(),
    _lastProcessId: 0,
    processes: [],
  };
  project.processes = [createProcess(project)];
  return project;
}

function createProcess(project: ProjectEntity): ProcessEntity {
  let id = 0;
  let xpdlId = "";
  do {
    id = ++project._lastProcessId;
    xpdlId = `${project.xpdlId}_wp${id}`;
  } while (project.processes.some((it) => it.detail.xpdlId === xpdlId));

  const detail: ProcessDetailEntity = {
    xpdlId,
    name: `プロセス${id}`,
    validFrom: "",
    validTo: "",

    _lastEnvironmentId: 0,
    environments: [],

    _lastApplicationId: 0,
    applications: [],
  };

  const process: ProcessEntity = {
    id,
    created: new Date().toISOString(),
    detail,

    _lastActorId: 0,
    actors: [],

    _lastNodeId: 0,
    activityNodes: [],
    otherNodes: [],

    _lastEdgeId: 0,
    edges: [],
  };
  process.actors = [createActor(process)];
  return process;
}

function createActor(process: ProcessEntity): ActorEntity {
  let id = 0;
  let xpdlId = "";
  do {
    id = ++process._lastActorId;
    xpdlId = `${process.detail.xpdlId}_par${id}`;
  } while (process.actors.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    name: `アクター${id}`,
  };
}

function createActivity(
  process: ProcessEntity,
  actorId: number,
  type: ActivityNodeType,
): ActivityNode {
  let id = 0;
  let xpdlId = "";
  do {
    id = ++process._lastNodeId;
    xpdlId = `${process.detail.xpdlId}_act${id}`;
  } while (process.activityNodes.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    type,
    name: "",
    actorId,
    applications: [],
    ognl: "",
    joinType: "notJoin",
    splitType: "notSplit",
    x: 0,
    y: 0,
    width: ACTIVITY_MIN_WIDTH,
    height: 0,
    selected: false,
  };
}

function createTransition(
  processXpdlId: string,
  transitions: TransitionEdge[],
  fromActivityId: number,
  toActivityId: number,
): TransitionEdge {
  let id = transitions.reduce((maxId, it) => Math.max(it.id, maxId), 0);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `${processXpdlId}_tra${id}`;
  } while (transitions.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    type: "transitionEdge",
    fromActivityId,
    toActivityId,
    selected: false,
  };
}

function createComment(process: ProcessEntity, x: number, y: number): CommentNode {
  const id = ++process._lastNodeId;

  return {
    id,
    type: "commentNode",
    comment: "コメント",
    x,
    y,
    width: 0,
    height: 0,
    selected: false,
  };
}

function createStartNode(process: ProcessEntity, x: number, y: number): StartNode {
  const id = ++process._lastNodeId;

  return {
    id,
    type: "startNode",
    x,
    y,
    width: NORMAL_ICON_SIZE,
    height: NORMAL_ICON_SIZE,
    selected: false,
  };
}

function createEndNode(process: ProcessEntity, x: number, y: number): EndNode {
  const id = ++process._lastNodeId;

  return {
    id,
    type: "endNode",
    x,
    y,
    width: NORMAL_ICON_SIZE,
    height: NORMAL_ICON_SIZE,
    selected: false,
  };
}

function createCommentEdge(id: number, fromCommentId: number, toActivityId: number): CommentEdge {
  return {
    id,
    type: "commentEdge",
    fromCommentId,
    toActivityId,
    selected: false,
  };
}

function createStartEdge(id: number, fromStartId: number, toActivityId: number): StartEdge {
  return {
    id,
    type: "startEdge",
    fromStartId,
    toActivityId,
    selected: false,
  };
}

function createEndEdge(id: number, fromActivityId: number, toEndId: number): EndEdge {
  return {
    id,
    type: "endEdge",
    fromActivityId,
    toEndId,
    selected: false,
  };
}

export const dataFactory = {
  createProject,
  createProcess,
  createActor,
  createActivity,
  createTransition,
  createComment,
  createCommentEdge,
  createStartNode,
  createStartEdge,
  createEndNode,
  createEndEdge,
};
