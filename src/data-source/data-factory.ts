import * as v from "valibot";

import { ACTIVITY_MIN_WIDTH, NORMAL_ICON_SIZE } from "@/constants/app-const";
import { I18nDict, i18nEnDict } from "@/constants/i18n";
import {
  ActivityNode,
  ActivityNodeType,
  ActorEntity,
  ActorId,
  actorIdSchema,
  ApplicationEntity,
  applicationIdSchema,
  CommentEdge,
  CommentNode,
  DateTime,
  dateTimeSchema,
  EdgeId,
  edgeIdSchema,
  EndEdge,
  EndNode,
  EnvironmentEntity,
  EnvironmentId,
  environmentIdSchema,
  IEdge,
  INode,
  NodeId,
  nodeIdSchema,
  ProcessEntity,
  ProjectEntity,
  StartEdge,
  StartNode,
  TransitionEdge,
  XpdlId,
  xpdlIdSchema,
} from "@/data-source/data-type";

let dict: I18nDict = i18nEnDict;

export function setDataFactoryDict(newDict: I18nDict) {
  dict = newDict;
}

export function toDateTime(dateTime = new Date().toISOString()): DateTime {
  return v.parse(dateTimeSchema, dateTime);
}

export function toXpdlId(xpdlId: string): XpdlId {
  return v.parse(xpdlIdSchema, xpdlId);
}

function createProject(created: DateTime = toDateTime()): ProjectEntity {
  const project: ProjectEntity = {
    created,
    detail: {
      xpdlId: toXpdlId("package"),
      name: dict.package,
    },
    processes: [createProcess([], created)],
  };
  return project;
}

function createProcess(
  processList: ProcessEntity[],
  created: DateTime = toDateTime(),
): ProcessEntity {
  let id = maxId(processList);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `process-${id}`;
  } while (processList.some((it) => it.detail.xpdlId === xpdlId));

  const process: ProcessEntity = {
    id,
    created,
    detail: {
      xpdlId: toXpdlId(xpdlId),
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

export function toEnvironmentId(envId: number): EnvironmentId {
  return v.parse(environmentIdSchema, envId);
}

function createEnvironment(environmentList: EnvironmentEntity[]): EnvironmentEntity {
  const id = maxId(environmentList) + 1;
  return {
    id: toEnvironmentId(id),
    name: `name${id}`,
    value: `value${id}`,
  };
}

function createApplication(applicationList: ApplicationEntity[]): ApplicationEntity {
  let id = maxId(applicationList);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `application-${id}`;
  } while (applicationList.some((it) => it.xpdlId === xpdlId));

  return {
    id: v.parse(applicationIdSchema, id),
    xpdlId: toXpdlId(xpdlId),
    name: `name${id}`,
    extendedName: "",
    extendedValue: "",
  };
}

export function toActorId(actorId: number): ActorId {
  return v.parse(actorIdSchema, actorId);
}

function createActorEntity(actorList: ActorEntity[]): ActorEntity {
  let id = maxId(actorList);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `actor-${id}`;
  } while (actorList.some((it) => it.xpdlId === xpdlId));

  return {
    id: toActorId(id),
    xpdlId: toXpdlId(xpdlId),
    name: `${dict.actor}${id}`,
  };
}

export function toNodeId(nodeId: number): NodeId {
  return v.parse(nodeIdSchema, nodeId);
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
  let xpdlId = "";
  do {
    activityId++;
    xpdlId = `activity-${activityId}`;
  } while (activityList.some((it) => it.xpdlId === xpdlId));

  return {
    id: toNodeId(maxId(nodeList) + 1),
    xpdlId: toXpdlId(xpdlId),
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

export function toEdgeId(id: number): EdgeId {
  return v.parse(edgeIdSchema, id);
}

function createTransitionEdge(
  edgeList: IEdge[],
  fromNodeId: NodeId,
  toNodeId: NodeId,
): TransitionEdge {
  const transitionList = edgeList.filter((it) => it.type === "transitionEdge") as TransitionEdge[];
  let transitionId = transitionList.length;
  let xpdlId = "";
  do {
    transitionId++;
    xpdlId = `transition-${transitionId}`;
  } while (transitionList.some((it) => it.xpdlId === xpdlId));

  return {
    id: toEdgeId(maxId(edgeList) + 1),
    xpdlId: toXpdlId(xpdlId),
    type: "transitionEdge",
    fromNodeId,
    toNodeId,
    ognl: "",
    selected: false,
  };
}

function createCommentNode(nodeList: INode[], x: number, y: number): CommentNode {
  return {
    id: toNodeId(maxId(nodeList) + 1),
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
    id: toEdgeId(maxId(edgeList) + 1),
    type: "commentEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createStartNode(nodeList: INode[], x: number, y: number): StartNode {
  return {
    id: toNodeId(maxId(nodeList) + 1),
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
    id: toEdgeId(maxId(edgeList) + 1),
    type: "startEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createEndNode(nodeList: INode[], x: number, y: number): EndNode {
  return {
    id: toNodeId(maxId(nodeList) + 1),
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
    id: toEdgeId(maxId(edgeList) + 1),
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
