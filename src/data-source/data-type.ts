import * as v from "valibot";

//
// Branded Type
//

export const dateTimeSchema = v.pipe(v.string(), v.brand("DateTime"));
export type DateTime = v.InferOutput<typeof dateTimeSchema>;

export const xpdlIdSchema = v.pipe(v.string(), v.nonEmpty(), v.brand("XpdlId"));
export type XpdlId = v.InferOutput<typeof xpdlIdSchema>;

export const applicationIdSchema = v.pipe(v.number(), v.integer(), v.brand("ApplicationId"));
export type ApplicationId = v.InferOutput<typeof applicationIdSchema>;

export const actorIdSchema = v.pipe(v.number(), v.integer(), v.brand("ActorId"));
export type ActorId = v.InferOutput<typeof actorIdSchema>;

export const environmentIdSchema = v.pipe(v.number(), v.integer(), v.brand("EnvironmentId"));
export type EnvironmentId = v.InferOutput<typeof environmentIdSchema>;

export const nodeIdSchema = v.pipe(v.number(), v.integer(), v.brand("NodeId"));
export type NodeId = v.InferOutput<typeof nodeIdSchema>;

export const edgeIdSchema = v.pipe(v.number(), v.integer(), v.brand("EdgeId"));
export type EdgeId = v.InferOutput<typeof edgeIdSchema>;

//
// Geometry
//

export const pointSchema = v.object({
  x: v.number(),
  y: v.number(),
});
export type Point = v.InferOutput<typeof pointSchema>;

export const lineSchema = v.object({
  p1: pointSchema,
  p2: pointSchema,
});
export type Line = v.InferOutput<typeof lineSchema>;

export const sizeSchema = v.object({
  width: v.number(),
  height: v.number(),
});
export type Size = v.InferOutput<typeof sizeSchema>;

export const rectangleSchema = v.object({
  ...pointSchema.entries,
  ...sizeSchema.entries,
});
export type Rectangle = v.InferOutput<typeof rectangleSchema>;

export const circleSchema = v.object({ cx: v.number(), cy: v.number(), r: v.number() });
export type Circle = v.InferOutput<typeof circleSchema>;

//
// Node
//

export const nodeTypeSchema = v.union([
  v.literal("activityNode"),
  v.literal("startNode"),
  v.literal("endNode"),
  v.literal("commentNode"),
]);
export type NodeType = v.InferOutput<typeof nodeTypeSchema>;

export const baseNodeSchema = v.object({
  ...rectangleSchema.entries,
  id: nodeIdSchema,
  type: nodeTypeSchema,
  selected: v.boolean(),
});
export type IBaseNode = v.InferOutput<typeof baseNodeSchema>;

export const activityNodeTypeSchema = v.union([
  v.literal("manualActivity"),
  v.literal("manualTimerActivity"),
  v.literal("autoActivity"),
  v.literal("autoTimerActivity"),
  v.literal("userActivity"),
]);
export type ActivityNodeType = v.InferOutput<typeof activityNodeTypeSchema>;

export const activityJoinTypeSchema = v.union([
  v.literal("notJoin"),
  v.literal("oneJoin"),
  v.literal("xorJoin"),
  v.literal("andJoin"),
]);
export type ActivityJoinType = v.InferOutput<typeof activityJoinTypeSchema>;

export const activitySplitTypeSchema = v.union([
  v.literal("notSplit"),
  v.literal("oneSplit"),
  v.literal("xorSplit"),
  v.literal("andSplit"),
]);
export type ActivitySplitType = v.InferOutput<typeof activitySplitTypeSchema>;

export const activityNodeSchema = v.object({
  ...baseNodeSchema.entries,
  type: v.literal("activityNode"),
  activityType: activityNodeTypeSchema,
  xpdlId: xpdlIdSchema,
  actorId: actorIdSchema,
  name: v.string(),
  applications: v.array(
    v.object({
      id: applicationIdSchema,
      ognl: v.string(),
    }),
  ),
  ognl: v.string(),
  joinType: activityJoinTypeSchema,
  splitType: activitySplitTypeSchema,
});
export type ActivityNode = v.InferOutput<typeof activityNodeSchema>;

export const startNodeSchema = v.object({
  ...baseNodeSchema.entries,
  type: v.literal("startNode"),
});
export type StartNode = v.InferOutput<typeof startNodeSchema>;

export const endNodeSchema = v.object({
  ...baseNodeSchema.entries,
  type: v.literal("endNode"),
});
export type EndNode = v.InferOutput<typeof endNodeSchema>;

export const commentNodeSchema = v.object({
  ...baseNodeSchema.entries,
  type: v.literal("commentNode"),
  comment: v.string(),
});
export type CommentNode = v.InferOutput<typeof commentNodeSchema>;

export const nodeSchema = v.union([
  activityNodeSchema,
  startNodeSchema,
  endNodeSchema,
  commentNodeSchema,
]);
export type INode = v.InferOutput<typeof nodeSchema>;

//
// Edge
//

const edgeTypeSchema = v.union([
  v.literal("transitionEdge"),
  v.literal("startEdge"),
  v.literal("endEdge"),
  v.literal("commentEdge"),
]);
export type EdgeType = v.InferOutput<typeof edgeTypeSchema>;

export const baseEdgeSchema = v.object({
  id: edgeIdSchema,
  type: edgeTypeSchema,
  fromNodeId: nodeIdSchema,
  toNodeId: nodeIdSchema,
  selected: v.boolean(),
});
export type IBaseEdge = v.InferOutput<typeof baseEdgeSchema>;

export const transitionEdgeSchema = v.object({
  ...baseEdgeSchema.entries,
  type: v.literal("transitionEdge"),
  xpdlId: xpdlIdSchema,
  ognl: v.string(),
});
export type TransitionEdge = v.InferOutput<typeof transitionEdgeSchema>;

export const startEdgeSchema = v.object({
  ...baseEdgeSchema.entries,
  type: v.literal("startEdge"),
});
export type StartEdge = v.InferOutput<typeof startEdgeSchema>;

export const endEdgeSchema = v.object({
  ...baseEdgeSchema.entries,
  type: v.literal("endEdge"),
});
export type EndEdge = v.InferOutput<typeof endEdgeSchema>;

export const commentEdgeSchema = v.object({
  ...baseEdgeSchema.entries,
  type: v.literal("commentEdge"),
});
export type CommentEdge = v.InferOutput<typeof commentEdgeSchema>;

export const edgeSchema = v.union([
  transitionEdgeSchema,
  startEdgeSchema,
  endEdgeSchema,
  commentEdgeSchema,
]);
export type IEdge = v.InferOutput<typeof edgeSchema>;

//
// Application
//

export const environmentEntitySchema = v.object({
  id: environmentIdSchema,
  name: v.string(),
  value: v.string(),
});
export type EnvironmentEntity = v.InferOutput<typeof environmentEntitySchema>;

export const applicationEntitySchema = v.object({
  id: applicationIdSchema,
  xpdlId: xpdlIdSchema,
  name: v.string(),
  extendedName: v.string(),
  extendedValue: v.string(),
});
export type ApplicationEntity = v.InferOutput<typeof applicationEntitySchema>;

export const processDetailEntitySchema = v.object({
  xpdlId: xpdlIdSchema,
  name: v.string(),
  validFrom: v.string(),
  validTo: v.string(),
  environments: v.array(environmentEntitySchema),
  applications: v.array(applicationEntitySchema),
});
export type ProcessDetailEntity = v.InferOutput<typeof processDetailEntitySchema>;

export const actorEntitySchema = v.object({
  id: actorIdSchema,
  xpdlId: xpdlIdSchema,
  name: v.string(),
});
export type ActorEntity = v.InferOutput<typeof actorEntitySchema>;

export const processEntitySchema = v.object({
  id: v.number(),
  created: dateTimeSchema,
  detail: processDetailEntitySchema,
  actors: v.array(actorEntitySchema),
  nodeList: v.array(nodeSchema),
  edgeList: v.array(edgeSchema),
});
export type ProcessEntity = v.InferOutput<typeof processEntitySchema>;

export const projectDetailEntitySchema = v.object({
  xpdlId: xpdlIdSchema,
  name: v.string(),
});
export type ProjectDetailEntity = v.InferOutput<typeof projectDetailEntitySchema>;

export const projectEntitySchema = v.object({
  created: dateTimeSchema,
  detail: projectDetailEntitySchema,
  processes: v.array(processEntitySchema),
});
export type ProjectEntity = v.InferOutput<typeof projectEntitySchema>;
