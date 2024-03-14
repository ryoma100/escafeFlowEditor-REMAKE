type datetime = string;

export type ProjectEntity = {
  xpdlId: string;
  name: string;
  created: datetime;

  _lastProcessId: number;
  processes: ProcessEntity[];
};

export type ProcessDetailEntity = {
  xpdlId: string;
  name: string;
  validFrom: string;
  validTo: string;

  _lastEnvironmentId: number;
  environments: EnvironmentEntity[];

  _lastApplicationId: number;
  applications: ApplicationEntity[];
};

export type ProcessEntity = {
  id: number;
  created: datetime;
  detail: ProcessDetailEntity;

  _lastActorId: number;
  actors: ActorEntity[];

  _lastNodeId: number;
  activityNodes: ActivityNode[];
  otherNodes: (CommentNode | StartNode | EndNode)[];

  _lastEdgeId: number;
  edges: (TransitionEdge | CommentEdge | StartEdge | EndEdge)[];
};

export type ActorEntity = {
  id: number;
  xpdlId: string;
  name: string;
};

export type EnvironmentEntity = {
  id: number;
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

//
// Graph
//

export type Graph = {
  nodes: ActivityNode[];
  edges: IEdge[];
};

//
// Node
//

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
  applications: {
    id: number;
    ognl: string;
  }[];
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

//
// Edge
//

export type EdgeType = "transitionEdge" | "commentEdge" | "startEdge" | "endEdge";

export interface IBaseEdge {
  id: number;
  type: EdgeType;
  fromNodeId: number;
  toNodeId: number;
  selected: boolean;
}

export type TransitionEdge = IBaseEdge & {
  type: "transitionEdge";
  xpdlId: string;
};

export type StartEdge = IBaseEdge & {
  type: "startEdge";
};

export type EndEdge = IBaseEdge & {
  type: "endEdge";
};

export type CommentEdge = IBaseEdge & {
  type: "commentEdge";
};

export type IEdge = TransitionEdge | StartEdge | IBaseEdge | CommentEdge;
