type datetime = string;

export type ProjectEntity = {
  created: datetime;
  detail: ProjectDetailEntity;
  processes: ProcessEntity[];
};

export type ProjectDetailEntity = {
  xpdlId: string;
  name: string;
};

export type ProcessEntity = Graph & {
  id: number;
  created: datetime;
  detail: ProcessDetailEntity;
  actors: ActorEntity[];
};

export type ProcessDetailEntity = {
  xpdlId: string;
  name: string;
  validFrom: string;
  validTo: string;
  environments: EnvironmentEntity[];
  applications: ApplicationEntity[];
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

export type ActorEntity = {
  id: number;
  xpdlId: string;
  name: string;
};

//
// Graph
//

type Graph = {
  nodes: INode[];
  edges: IEdge[];
};

export type Point = {
  x: number;
  y: number;
};

export type Line = {
  p1: Point;
  p2: Point;
};

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Circle = { cx: number; cy: number; r: number };

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
export type ActivityJoinType = "notJoin" | "oneJoin" | "xorJoin" | "andJoin";
export type ActivitySplitType = "notSplit" | "oneSplit" | "xorSplit" | "andSplit";

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
  joinType: ActivityJoinType;
  splitType: ActivitySplitType;
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
  ognl: string;
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

export type IEdge = TransitionEdge | StartEdge | EndEdge | CommentEdge;
