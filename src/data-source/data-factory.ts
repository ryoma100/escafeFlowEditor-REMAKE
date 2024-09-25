import { ACTIVITY_MIN_WIDTH, NORMAL_ICON_SIZE } from "@/constants/app-const";
import { I18nDict, i18nEnDict } from "@/constants/i18n";
import {
  ActivityNode,
  ActivityNodeType,
  ActorEntity,
  ActorId,
  ApplicationEntity,
  ApplicationId,
  CommentEdge,
  CommentNode,
  DateTime,
  EdgeId,
  EndEdge,
  EndNode,
  EnvironmentEntity,
  EnvironmentId,
  IEdge,
  INode,
  NodeId,
  ProcessEntity,
  ProcessId,
  ProjectEntity,
  StartEdge,
  StartNode,
  TransitionEdge,
  XpdlId,
} from "@/data-source/data-type";

let dict: I18nDict = i18nEnDict;

export function setDataFactoryDict(newDict: I18nDict) {
  dict = newDict;
}

function createProject(created: DateTime = new Date().toISOString() as DateTime): ProjectEntity {
  const project: ProjectEntity = {
    created,
    detail: {
      xpdlId: "package" as XpdlId,
      name: dict.package,
    },
    processes: [createProcess([], created)],
  };
  return project;
}

function createProcess(
  processList: ProcessEntity[],
  created: DateTime = new Date().toISOString() as DateTime,
): ProcessEntity {
  let id = maxId(processList) as ProcessId;
  let xpdlId = "" as XpdlId;
  do {
    id++;
    xpdlId = `process-${id}` as XpdlId;
  } while (processList.some((it) => it.detail.xpdlId === xpdlId));

  const process: ProcessEntity = {
    id,
    created,
    detail: {
      xpdlId,
      name: `${dict.process}${id}`,
      validFrom: "",
      validTo: "",
      environments: [],
      applications: [],
    },
    actors: [createActorEntity([])],
    nodeList: [],
    edgeList: [],
  };
  return process;
}

function createEnvironment(environmentList: EnvironmentEntity[]): EnvironmentEntity {
  const id = (maxId(environmentList) + 1) as EnvironmentId;
  return {
    id,
    name: `name${id}`,
    value: `value${id}`,
  };
}

function createApplication(applicationList: ApplicationEntity[]): ApplicationEntity {
  let id = maxId(applicationList) as ApplicationId;
  let xpdlId = "" as XpdlId;
  do {
    id++;
    xpdlId = `application-${id}` as XpdlId;
  } while (applicationList.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    name: `name${id}`,
    extendedName: "",
    extendedValue: "",
  };
}

function createActorEntity(actorList: ActorEntity[]): ActorEntity {
  let id = maxId(actorList) as ActorId;
  let xpdlId = "" as XpdlId;
  do {
    id++;
    xpdlId = `actor-${id}` as XpdlId;
  } while (actorList.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    name: `${dict.actor}${id}`,
  };
}

function createActivityNode(
  nodeList: INode[],
  actorId: ActorId,
  activityType: ActivityNodeType,
  cx: number,
  cy: number,
): ActivityNode {
  const activityList = nodeList.filter((it) => it.type === "activityNode") as ActivityNode[];
  let activityId = activityList.length;
  let xpdlId = "" as XpdlId;
  do {
    activityId++;
    xpdlId = `activity-${activityId}` as XpdlId;
  } while (activityList.some((it) => it.xpdlId === xpdlId));

  return {
    id: (maxId(nodeList) + 1) as NodeId,
    xpdlId,
    type: "activityNode",
    activityType,
    name: `${dict.work}${activityId}`,
    actorId,
    applications: [],
    ognl: "",
    joinType: "notJoin",
    splitType: "notSplit",
    x: cx - ACTIVITY_MIN_WIDTH / 2,
    y: cy,
    width: ACTIVITY_MIN_WIDTH,
    height: 0,
    selected: false,
  };
}

function createTransitionEdge(
  edgeList: IEdge[],
  fromNodeId: NodeId,
  toNodeId: NodeId,
): TransitionEdge {
  const transitionList = edgeList.filter((it) => it.type === "transitionEdge") as TransitionEdge[];
  let transitionId = transitionList.length;
  let xpdlId = "" as XpdlId;
  do {
    transitionId++;
    xpdlId = `transition-${transitionId}` as XpdlId;
  } while (transitionList.some((it) => it.xpdlId === xpdlId));

  return {
    id: (maxId(edgeList) + 1) as EdgeId,
    xpdlId,
    type: "transitionEdge",
    fromNodeId,
    toNodeId,
    ognl: "",
    selected: false,
  };
}

function createCommentNode(nodeList: INode[], x: number, y: number): CommentNode {
  return {
    id: (maxId(nodeList) + 1) as NodeId,
    type: "commentNode",
    comment: dict.comment,
    x,
    y,
    width: 0,
    height: 0,
    selected: false,
  };
}

function createCommentEdge(edgeList: IEdge[], fromNodeId: NodeId, toNodeId: NodeId): CommentEdge {
  return {
    id: (maxId(edgeList) + 1) as EdgeId,
    type: "commentEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createStartNode(nodeList: INode[], x: number, y: number): StartNode {
  return {
    id: (maxId(nodeList) + 1) as NodeId,
    type: "startNode",
    x,
    y,
    width: NORMAL_ICON_SIZE,
    height: NORMAL_ICON_SIZE,
    selected: false,
  };
}

function createStartEdge(edgeList: IEdge[], fromNodeId: NodeId, toNodeId: NodeId): StartEdge {
  return {
    id: (maxId(edgeList) + 1) as EdgeId,
    type: "startEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createEndNode(nodeList: INode[], x: number, y: number): EndNode {
  return {
    id: (maxId(nodeList) + 1) as NodeId,
    type: "endNode",
    x,
    y,
    width: NORMAL_ICON_SIZE,
    height: NORMAL_ICON_SIZE,
    selected: false,
  };
}

function createEndEdge(edgeList: IEdge[], fromNodeId: NodeId, toNodeId: NodeId): EndEdge {
  return {
    id: (maxId(edgeList) + 1) as EdgeId,
    type: "endEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function maxId(list: { id: number }[]): number {
  return list.reduce((maxId, it) => Math.max(it.id, maxId), 0);
}

export const dataFactory = {
  createProject,
  createProcess,
  createEnvironment,
  createApplication,
  createActorEntity,
  createActivityNode,
  createTransitionEdge,
  createCommentNode,
  createCommentEdge,
  createStartNode,
  createStartEdge,
  createEndNode,
  createEndEdge,
};

export function deepUnwrap<T extends object>(data: T): T {
  // solid-js/store unwrap is not nested.
  return JSON.parse(JSON.stringify(data));
}
