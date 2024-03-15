import { ACTIVITY_MIN_WIDTH, NORMAL_ICON_SIZE } from "../constants/app-const";
import {
  ActivityNode,
  ActivityNodeType,
  ActorEntity,
  ApplicationEntity,
  CommentEdge,
  CommentNode,
  EndEdge,
  EndNode,
  EnvironmentEntity,
  IEdge,
  INode,
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
    processes: [],
  };
  project.processes = [createProcess(project)];
  return project;
}

function createProcess(project: ProjectEntity): ProcessEntity {
  let id = project.processes.reduce((maxId, it) => Math.max(maxId, it.id), 0);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `${project.xpdlId}_wp${id}`;
  } while (project.processes.some((it) => it.detail.xpdlId === xpdlId));

  const process: ProcessEntity = {
    id,
    created: new Date().toISOString(),
    detail: {
      xpdlId,
      name: `プロセス${id}`,
      validFrom: "",
      validTo: "",
      environments: [],
      applications: [],
    },
    actors: [],
    nodes: [],
    edges: [],
  };
  process.actors = [createActor(process)];
  return process;
}

function createEnvironment(process: ProcessEntity): EnvironmentEntity {
  const id = process.detail.environments.reduce((maxId, it) => Math.max(maxId, it.id), 0) + 1;
  return {
    id,
    name: `name${id}`,
    value: `value${id}`,
  };
}

function createApplication(process: ProcessEntity): ApplicationEntity {
  const id = process.detail.applications.reduce((maxId, it) => Math.max(maxId, it.id), 0) + 1;
  return {
    id,
    xpdlId: `xpdlId${id}`,
    name: `name${id}`,
    extendedName: "",
    extendedValue: "",
  };
}

function createActor(process: ProcessEntity): ActorEntity {
  let id = process.actors.reduce((maxId, it) => Math.max(maxId, it.id), 0);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `${process.detail.xpdlId}_par${id}`;
  } while (process.actors.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    name: `アクター${id}`,
  };
}

function createActivity(
  processXpdlId: string,
  nodeList: INode[],
  actorId: number,
  activityType: ActivityNodeType,
): ActivityNode {
  const activityList = nodeList.filter((it) => it.type === "activityNode") as ActivityNode[];
  let id = nodeList.reduce((maxId, it) => Math.max(it.id, maxId), 0);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `${processXpdlId}_act${id}`;
  } while (activityList.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    type: "activityNode",
    activityType,
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
  edgeList: IEdge[],
  fromNodeId: number,
  toNodeId: number,
): TransitionEdge {
  const transitionList = edgeList.filter((it) => it.type === "transitionEdge") as TransitionEdge[];
  let id = edgeList.reduce((maxId, it) => Math.max(it.id, maxId), 0);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `${processXpdlId}_tra${id}`;
  } while (transitionList.some((it: TransitionEdge) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    type: "transitionEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createComment(id: number, x: number, y: number): CommentNode {
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

function createStartNode(id: number, x: number, y: number): StartNode {
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

function createEndNode(id: number, x: number, y: number): EndNode {
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

function createCommentEdge(id: number, fromNodeId: number, toNodeId: number): CommentEdge {
  return {
    id,
    type: "commentEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createStartEdge(id: number, fromNodeId: number, toNodeId: number): StartEdge {
  return {
    id,
    type: "startEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createEndEdge(id: number, fromNodeId: number, toNodeId: number): EndEdge {
  return {
    id,
    type: "endEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

export const dataFactory = {
  createProject,
  createProcess,
  createEnvironment,
  createApplication,
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
