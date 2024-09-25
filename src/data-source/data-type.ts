type Brand<K, T> = K & { __brand: T };

export type DateTime = Brand<string, "DateTime">;
export type XpdlId = Brand<string, "XpdlId">;

export type ProjectEntity = {
  created: DateTime;
  detail: ProjectDetailEntity;
  processes: ProcessEntity[];
};

export type ProjectDetailEntity = {
  xpdlId: XpdlId;
  name: string;
};

export type ProcessId = Brand<number, "ProcessId">;
export type ProcessEntity = Graph & {
  id: ProcessId;
  created: DateTime;
  detail: ProcessDetailEntity;
  actors: ActorEntity[];
};

export type ProcessDetailEntity = {
  xpdlId: XpdlId;
  name: string;
  validFrom: string;
  validTo: string;
  environments: EnvironmentEntity[];
  applications: ApplicationEntity[];
};

export type EnvironmentId = Brand<number, "EnvironmentId">;
export type EnvironmentEntity = {
  id: EnvironmentId;
  name: string;
  value: string;
};

export type ApplicationId = Brand<number, "ApplicationId">;
export type ApplicationEntity = {
  id: ApplicationId;
  xpdlId: XpdlId;
  name: string;
  extendedName: string;
  extendedValue: string;
};

export type ActorId = Brand<number, "ActorId">;
export type ActorEntity = {
  id: ActorId;
  xpdlId: XpdlId;
  name: string;
};

//
// Graph
//

type Graph = {
  nodeList: INode[];
  edgeList: IEdge[];
};

export type Point = {
  x: number;
  y: number;
};

export type Line = {
  p1: Point;
  p2: Point;
};

export type Size = {
  width: number;
  height: number;
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

export type NodeId = Brand<number, "NodeId">;
type IBaseNode = Rectangle & {
  id: NodeId;
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
  xpdlId: XpdlId;
  actorId: ActorId;
  name: string;
  applications: {
    id: ApplicationId;
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

export type EdgeId = Brand<number, "EdgeId">;
type IBaseEdge = {
  id: EdgeId;
  type: EdgeType;
  fromNodeId: NodeId;
  toNodeId: NodeId;
  selected: boolean;
};

export type TransitionEdge = IBaseEdge & {
  type: "transitionEdge";
  xpdlId: XpdlId;
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
