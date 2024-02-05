type datetime = string;

export type PackageEntity = {
  xpdlId: string;
  name: string;
  created: datetime;

  _lastProcessId: number;
  processes: ProcessEntity[];
};

export type ProcessEntity = {
  id: number;
  xpdlId: string;
  name: string;
  created: datetime;
  enviroments: EnviromentEntity[];
  validFrom: string;
  validTo: string;

  _lastActorId: number;
  actors: ActorEntity[];

  _lastApplicationId: number;
  applications: ApplicationEntity[];

  _lastActivityId: number;
  activities: ActivityEntity[];

  _lastTransitionId: number;
  transitions: TransitionEntity[];

  _lastCommentId: number;
  comments: CommentEntity[];
};

export type ActorEntity = {
  id: number;
  xpdlId: string;
  name: string;
};

export type EnviromentEntity = {
  name: string;
  value: string;
};

export type ApplicationEntity = {
  id: number;
  xpdlId: string;
  name: string;
  extendedName: string;
  extendedValue: string;
};

export type ActivityEntity = {
  id: number;
  xpdlId: string;
  type: "manual" | "auto" | "hand";
  name: string;
  actorId: number;
  ognl: string;
  joinType: "none" | "xor" | "and";
  splitType: "none" | "xor" | "and";
  cx: number;
  cy: number;
  width: number;
  selected: boolean;
};

export type TransitionEntity = {
  id: number;
  xpdlId: string;
  fromActivityId: number;
  toActivityId: number;
};

export type CommentEntity = {
  id: number;
  comment: string;
  x: number;
  y: number;
  selected: boolean;
};

export type StartStopEntity = {
  id: number;
  name: "start" | "end";
  x: number;
  y: number;
  selected: boolean;
};
