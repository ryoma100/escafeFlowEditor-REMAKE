import {
  PackageEntity,
  ProcessEntity,
  ActorEntity,
  ActivityEntity,
  TransitionEntity,
} from "./data-type";

function createPackage(): PackageEntity {
  const pkg: PackageEntity = {
    xpdlId: "newpkg",
    name: "パッケージ",
    created: new Date().toISOString(),
    _lastProcessId: 0,
    processes: [],
  };
  pkg.processes = [createProcess(pkg)];
  return pkg;
}

function createProcess(pkg: PackageEntity): ProcessEntity {
  let id = 0;
  let xpdlId = "";
  do {
    id = ++pkg._lastProcessId;
    xpdlId = `${pkg.xpdlId}_wp${id}`;
  } while (pkg.processes.some((it) => it.xpdlId === xpdlId));

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
    _lastAttributeId: 0,
    attributes: [],
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
  type: ActivityEntity["type"]
): ActivityEntity {
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
    cx: 0,
    cy: 0,
    width: 0,
  };
}

function createTransition(
  process: ProcessEntity,
  fromActivityId: number,
  toActivityId: number
): TransitionEntity {
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

export const dataFactory = {
  createPackage,
  createProcess,
  createActor,
  createActivity,
  createTransition,
};
