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

export type INode = {
  id: number;
  type: "activity" | "comment" | "start" | "end";
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
};

export type ActivityNodeEntity = INode & {
  xpdlId: string;
  type: "activity";
  activityType: "manual" | "auto" | "hand";
  name: string;
  actorId: number;
  ognl: string;
  joinType: "none" | "xor" | "and";
  splitType: "none" | "xor" | "and";
};

export type CommentNodeEntity = INode & {
  type: "comment";
  comment: string;
};

export type StartNodeEntity = INode & {
  type: "start";
};

export type EndNodeEntity = INode & {
  type: "end";
};

export type IEdge = {
  id: number;
  type: "transition" | "comment" | "start" | "end";
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

export type TransitionEdgeEntity = IEdge & {
  type: "transition";
  xpdlId: string;
  fromActivityId: number;
  toActivityId: number;
};

export type CommentEdgeEntity = IEdge & {
  type: "comment";
  fromCommentId: number;
  toActivityId: number;
};

export type StartEdgeEntity = IEdge & {
  type: "start";
  toActivityId: number;
};

export type EndEdgeEntity = IEdge & {
  type: "end";
  fromActivityId: number;
};
