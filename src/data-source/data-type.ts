import type * as v from "valibot";

import type {
  activityJoinTypeSchema,
  activityNodeSchema,
  activityNodeTypeSchema,
  activitySplitTypeSchema,
  actorEntitySchema,
  actorIdSchema,
  applicationEntitySchema,
  applicationIdSchema,
  baseEdgeSchema,
  baseNodeSchema,
  circleSchema,
  commentEdgeSchema,
  commentNodeSchema,
  dateTimeSchema,
  edgeIdSchema,
  edgeSchema,
  edgeTypeSchema,
  endEdgeSchema,
  endNodeSchema,
  environmentEntitySchema,
  environmentIdSchema,
  lineSchema,
  nodeIdSchema,
  nodeSchema,
  nodeTypeSchema,
  pointSchema,
  processDetailEntitySchema,
  processEntitySchema,
  projectDetailEntitySchema,
  projectEntitySchema,
  rectangleSchema,
  sizeSchema,
  startEdgeSchema,
  startNodeSchema,
  transitionEdgeSchema,
  xpdlIdSchema,
} from "@/data-source/data-schema";

//
// Branded Type
//

export type DateTime = v.InferOutput<typeof dateTimeSchema>;
export type XpdlId = v.InferOutput<typeof xpdlIdSchema>;
export type ApplicationId = v.InferOutput<typeof applicationIdSchema>;
export type ActorId = v.InferOutput<typeof actorIdSchema>;
export type EnvironmentId = v.InferOutput<typeof environmentIdSchema>;
export type NodeId = v.InferOutput<typeof nodeIdSchema>;
export type EdgeId = v.InferOutput<typeof edgeIdSchema>;

//
// Geometry
//

export type Point = v.InferOutput<typeof pointSchema>;
export type Line = v.InferOutput<typeof lineSchema>;
export type Size = v.InferOutput<typeof sizeSchema>;
export type Rectangle = v.InferOutput<typeof rectangleSchema>;
export type Circle = v.InferOutput<typeof circleSchema>;

//
// Node
//

export type NodeType = v.InferOutput<typeof nodeTypeSchema>;
export type IBaseNode = v.InferOutput<typeof baseNodeSchema>;
export type ActivityNodeType = v.InferOutput<typeof activityNodeTypeSchema>;
export type ActivityJoinType = v.InferOutput<typeof activityJoinTypeSchema>;
export type ActivitySplitType = v.InferOutput<typeof activitySplitTypeSchema>;
export type ActivityNode = v.InferOutput<typeof activityNodeSchema>;
export type StartNode = v.InferOutput<typeof startNodeSchema>;
export type EndNode = v.InferOutput<typeof endNodeSchema>;
export type CommentNode = v.InferOutput<typeof commentNodeSchema>;
export type INode = v.InferOutput<typeof nodeSchema>;

//
// Edge
//

export type EdgeType = v.InferOutput<typeof edgeTypeSchema>;
export type IBaseEdge = v.InferOutput<typeof baseEdgeSchema>;
export type TransitionEdge = v.InferOutput<typeof transitionEdgeSchema>;
export type StartEdge = v.InferOutput<typeof startEdgeSchema>;
export type EndEdge = v.InferOutput<typeof endEdgeSchema>;
export type CommentEdge = v.InferOutput<typeof commentEdgeSchema>;
export type IEdge = v.InferOutput<typeof edgeSchema>;

//
// Application
//

export type EnvironmentEntity = v.InferOutput<typeof environmentEntitySchema>;
export type ApplicationEntity = v.InferOutput<typeof applicationEntitySchema>;
export type ProcessDetailEntity = v.InferOutput<typeof processDetailEntitySchema>;
export type ActorEntity = v.InferOutput<typeof actorEntitySchema>;
export type ProcessEntity = v.InferOutput<typeof processEntitySchema>;
export type ProjectDetailEntity = v.InferOutput<typeof projectDetailEntitySchema>;
export type ProjectEntity = v.InferOutput<typeof projectEntitySchema>;
