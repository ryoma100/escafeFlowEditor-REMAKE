type datetime = string;

export type ProjectEntity = {
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
  activities: ActivityNodeEntity[];

  _lastTransitionId: number;
  transitions: TransitionEdgeEntity[];

  _lastCommentId: number;
  comments: CommentNodeEntity[];
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

export type ActivityNodeEntity = {
  id: number;
  xpdlId: string;
  type: "manual" | "auto" | "hand";
  name: string;
  actorId: number;
  ognl: string;
  joinType: "none" | "xor" | "and";
  splitType: "none" | "xor" | "and";
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
};

export type TransitionEdgeEntity = {
  id: number;
  xpdlId: string;
  fromActivityId: number;
  toActivityId: number;
};

export type CommentNodeEntity = {
  id: number;
  comment: string;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
};

export type StartStopNodeEntity = {
  id: number;
  name: "start" | "end";
  x: number;
  y: number;
  selected: boolean;
};
