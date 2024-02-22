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

  _lastNodeId: number;
  activityNodes: ActivityNode[];
  otherNodes: (CommentNode | StartNode | EndNode)[];

  _lastEdgeId: number;
  transitionEdges: TransitionEdge[];
  otherEdges: (CommentEdge | StartEdge | EndEdge)[];
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

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface INode extends Rectangle {
  id: number;
  type: NodeType;
  selected: boolean;
}

export type JoinType = "notJoin" | "oneJoin" | "xorJoin" | "andJoin";
export type SplitType = "notSplit" | "oneSplit" | "xorSplit" | "andSplit";

export type ActivityNode = INode & {
  type: ActivityNodeType;
  xpdlId: string;
  actorId: number;
  name: string;
  ognl: string;
  joinType: JoinType;
  splitType: SplitType;
};

export type CommentNode = INode & {
  type: "commentNode";
  comment: string;
};

export type StartNode = INode & {
  type: "startNode";
};

export type EndNode = INode & {
  type: "endNode";
};

export type EdgeType = "transitionEdge" | "commentEdge" | "startEdge" | "endEdge";

export interface IEdge {
  id: number;
  type: EdgeType;
  selected: boolean;
}

export type TransitionEdge = IEdge & {
  type: "transitionEdge";
  xpdlId: string;
  fromActivityId: number;
  toActivityId: number;
};

export type CommentEdge = IEdge & {
  type: "commentEdge";
  fromCommentId: number;
  toActivityId: number;
};

export type StartEdge = IEdge & {
  type: "startEdge";
  fromStartId: number;
  toActivityId: number;
};

export type EndEdge = IEdge & {
  type: "endEdge";
  fromActivityId: number;
  toEndId: number;
};
