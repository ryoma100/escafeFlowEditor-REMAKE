import { ACTIVITY_MIN_WIDTH } from "./data-source";
import {
  ProjectEntity,
  ProcessEntity,
  ActorEntity,
  ActivityNodeEntity,
  TransitionEdgeEntity,
  CommentNodeEntity,
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
  } while (project.processes.some((it) => it.xpdlId === xpdlId));

  const process: ProcessEntity = {
    id,
    xpdlId,
    name: `プロセス${id}`,
    created: new Date().toISOString(),
    enviroments: [],
    validFrom: "",
    validTo: "",
    _lastActorId: 0,
    actors: [],
    _lastApplicationId: 0,
    applications: [],
    _lastActivityId: 0,
    activities: [],
    _lastTransitionId: 0,
    transitions: [],
    _lastCommentId: 0,
    comments: [],
  };
  process.actors = [createActor(process)];
  return process;
}

function createActor(process: ProcessEntity): ActorEntity {
  let id = 0;
  let xpdlId = "";
  do {
    id = ++process._lastActorId;
    xpdlId = `${process.xpdlId}_par${id}`;
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
  type: ActivityNodeEntity["type"]
): ActivityNodeEntity {
  let id = 0;
  let xpdlId = "";
  do {
    id = ++process._lastActivityId;
    xpdlId = `${process.xpdlId}_act${id}`;
  } while (process.activities.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    type,
    name: "",
    actorId,
    ognl: "",
    joinType: "none",
    splitType: "none",
    x: 0,
    y: 0,
    width: ACTIVITY_MIN_WIDTH,
    height: 0,
    selected: false,
  };
}

function createTransition(
  process: ProcessEntity,
  fromActivityId: number,
  toActivityId: number
): TransitionEdgeEntity {
  let id = 0;
  let xpdlId = "";
  do {
    id = ++process._lastTransitionId;
    xpdlId = `${process.xpdlId}_tra${id}`;
  } while (process.transitions.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    fromActivityId,
    toActivityId,
  };
}

function createComment(process: ProcessEntity): CommentNodeEntity {
  const id = ++process._lastCommentId;

  return {
    id,
    comment: "コメント",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    selected: false,
  };
}

export const dataFactory = {
  createProject: createProject,
  createProcess,
  createActor,
  createActivity,
  createTransition,
  createComment,
};
