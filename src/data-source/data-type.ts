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

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

//
// Node
//

export type NodeType = "activityNode" | "startNode" | "endNode" | "commentNode";

type IBaseNode = Rectangle & {
  id: number;
  type: NodeType;
  selected: boolean;
};

export type ActivityNodeType =
  | "manualActivity"
  | "manualTimerActivity"
  | "autoActivity"
  | "autoTimerActivity"
  | "userActivity";

export type JoinType = "notJoin" | "oneJoin" | "xorJoin" | "andJoin";
export type SplitType = "notSplit" | "oneSplit" | "xorSplit" | "andSplit";

export type ActivityNode = IBaseNode & {
  type: "activityNode";
  activityType: ActivityNodeType;
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

export type StartNode = IBaseNode & {
  type: "startNode";
};

export type EndNode = IBaseNode & {
  type: "endNode";
};

export type CommentNode = IBaseNode & {
  type: "commentNode";
  comment: string;
};

export type INode = ActivityNode | StartNode | EndNode | CommentNode;

//
// Edge
//

export type EdgeType = "transitionEdge" | "startEdge" | "endEdge" | "commentEdge";

type IBaseEdge = {
  id: number;
  type: EdgeType;
  fromNodeId: number;
  toNodeId: number;
  selected: boolean;
};

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
