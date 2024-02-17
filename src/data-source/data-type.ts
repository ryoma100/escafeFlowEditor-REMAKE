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
  environments: EnvironmentEntity[];
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

export type EnvironmentEntity = {
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

export type ActivityNodeType =
  | "manualActivity"
  | "manualTimerActivity"
  | "autoActivity"
  | "autoTimerActivity"
  | "userActivity";
export type NodeType = ActivityNodeType | "commentNode" | "startNode" | "endNode";

export type INode = {
  id: number;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
};

export type JoinType = "notJoin" | "oneJoin" | "xorJoin" | "andJoin";
export type SplitType = "notSplit" | "oneSplit" | "xorSplit" | "andSplit";

export type ActivityNodeEntity = INode & {
  xpdlId: string;
  type: ActivityNodeType;
  name: string;
  actorId: number;
  ognl: string;
  joinType: JoinType;
  splitType: SplitType;
};

export type CommentNodeEntity = INode & {
  type: "commentNode";
  comment: string;
};

export type StartNodeEntity = INode & {
  type: "startNode";
};

export type EndNodeEntity = INode & {
  type: "endNode";
};

export type EdgeType = "transitionEdge" | "commentEdge" | "startEdge" | "endEdge";

export type IEdge = {
  id: number;
  type: EdgeType;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

export type TransitionEdgeEntity = IEdge & {
  type: "transitionEdge";
  xpdlId: string;
  fromActivityId: number;
  toActivityId: number;
};

export type CommentEdgeEntity = IEdge & {
  type: "commentEdge";
  fromCommentId: number;
  toActivityId: number;
};

export type StartEdgeEntity = IEdge & {
  type: "startEdge";
  toActivityId: number;
};

export type EndEdgeEntity = IEdge & {
  type: "endEdge";
  fromActivityId: number;
};
