import * as v from "valibot";

//
// Branded Type
//

export const dateTimeSchema = v.pipe(v.string(), v.brand("DateTime"));
export const xpdlIdSchema = v.pipe(v.string(), v.nonEmpty(), v.brand("XpdlId"));
export const applicationIdSchema = v.pipe(v.number(), v.integer(), v.brand("ApplicationId"));
export const actorIdSchema = v.pipe(v.number(), v.integer(), v.brand("ActorId"));
export const environmentIdSchema = v.pipe(v.number(), v.integer(), v.brand("EnvironmentId"));
export const nodeIdSchema = v.pipe(v.number(), v.integer(), v.brand("NodeId"));
export const edgeIdSchema = v.pipe(v.number(), v.integer(), v.brand("EdgeId"));

//
// Geometry
//

export const pointSchema = v.object({
  x: v.number(),
  y: v.number(),
});

export const lineSchema = v.object({
  p1: pointSchema,
  p2: pointSchema,
});

export const sizeSchema = v.object({
  width: v.number(),
  height: v.number(),
});

export const rectangleSchema = v.object({
  ...pointSchema.entries,
  ...sizeSchema.entries,
});

export const circleSchema = v.object({ cx: v.number(), cy: v.number(), r: v.number() });

//
// Node
//

export const nodeTypeSchema = v.union([
  v.literal("activityNode"),
  v.literal("startNode"),
  v.literal("endNode"),
  v.literal("commentNode"),
]);

export const baseNodeSchema = v.object({
  ...rectangleSchema.entries,
  id: nodeIdSchema,
  type: nodeTypeSchema,
  selected: v.boolean(),
});

export const activityNodeTypeSchema = v.union([
  v.literal("manualActivity"),
  v.literal("manualTimerActivity"),
  v.literal("autoActivity"),
  v.literal("autoTimerActivity"),
  v.literal("userActivity"),
]);

export const activityJoinTypeSchema = v.union([
  v.literal("notJoin"),
  v.literal("oneJoin"),
  v.literal("xorJoin"),
  v.literal("andJoin"),
]);

export const activitySplitTypeSchema = v.union([
  v.literal("notSplit"),
  v.literal("oneSplit"),
  v.literal("xorSplit"),
  v.literal("andSplit"),
]);

export const activityNodeSchema = v.pipe(
  v.object({
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
  }),
  v.check(({ applications }) => {
    return new Set(applications.map((it) => it.id)).size === applications.length;
  }, "duplicate application id"),
);

export const startNodeSchema = v.object({
  ...baseNodeSchema.entries,
  type: v.literal("startNode"),
});

export const endNodeSchema = v.object({
  ...baseNodeSchema.entries,
  type: v.literal("endNode"),
});

export const commentNodeSchema = v.object({
  ...baseNodeSchema.entries,
  type: v.literal("commentNode"),
  comment: v.string(),
});

export const nodeSchema = v.union([
  activityNodeSchema,
  startNodeSchema,
  endNodeSchema,
  commentNodeSchema,
]);

//
// Edge
//

export const edgeTypeSchema = v.union([
  v.literal("transitionEdge"),
  v.literal("startEdge"),
  v.literal("endEdge"),
  v.literal("commentEdge"),
]);

export const baseEdgeSchema = v.object({
  id: edgeIdSchema,
  type: edgeTypeSchema,
  fromNodeId: nodeIdSchema,
  toNodeId: nodeIdSchema,
  selected: v.boolean(),
  disabled: v.boolean(),
});

export const transitionEdgeSchema = v.object({
  ...baseEdgeSchema.entries,
  type: v.literal("transitionEdge"),
  xpdlId: xpdlIdSchema,
  ognl: v.string(),
});

export const startEdgeSchema = v.object({
  ...baseEdgeSchema.entries,
  type: v.literal("startEdge"),
});

export const endEdgeSchema = v.object({
  ...baseEdgeSchema.entries,
  type: v.literal("endEdge"),
});

export const commentEdgeSchema = v.object({
  ...baseEdgeSchema.entries,
  type: v.literal("commentEdge"),
});

export const edgeSchema = v.union([
  transitionEdgeSchema,
  startEdgeSchema,
  endEdgeSchema,
  commentEdgeSchema,
]);

//
// Application
//

export const environmentEntitySchema = v.object({
  id: environmentIdSchema,
  name: v.string(),
  value: v.string(),
});

export const applicationEntitySchema = v.object({
  id: applicationIdSchema,
  xpdlId: xpdlIdSchema,
  name: v.string(),
  extendedName: v.string(),
  extendedValue: v.string(),
});

export const processDetailEntitySchema = v.pipe(
  v.object({
    xpdlId: xpdlIdSchema,
    name: v.string(),
    validFrom: v.string(),
    validTo: v.string(),
    environments: v.array(environmentEntitySchema),
    applications: v.array(applicationEntitySchema),
  }),
  v.check(({ environments }) => {
    return new Set(environments.map((it) => it.id)).size === environments.length;
  }, "duplicate environment id"),
  v.check(({ applications }) => {
    return new Set(applications.map((it) => it.id)).size === applications.length;
  }, "duplicate application id"),
  v.check(({ applications }) => {
    return new Set(applications.map((it) => it.xpdlId)).size === applications.length;
  }, "duplicate application xpdlId"),
);

export const actorEntitySchema = v.object({
  id: actorIdSchema,
  xpdlId: xpdlIdSchema,
  name: v.string(),
});

export const processEntitySchema = v.pipe(
  v.object({
    id: v.number(),
    created: dateTimeSchema,
    detail: processDetailEntitySchema,
    actors: v.array(actorEntitySchema),
    nodeList: v.array(nodeSchema),
    edgeList: v.array(edgeSchema),
  }),
  v.check(({ actors }) => {
    return new Set(actors.map((it) => it.id)).size === actors.length;
  }, "duplicate actor id"),
  v.check(({ actors }) => {
    return new Set(actors.map((it) => it.xpdlId)).size === actors.length;
  }, "duplicate actor xpdlId"),
  v.check(({ nodeList }) => {
    return new Set(nodeList.map((it) => it.id)).size === nodeList.length;
  }, "duplicate node id"),
  v.check(({ nodeList }) => {
    const activities = nodeList.filter((it) => it.type === "activityNode");
    return new Set(activities.map((it) => it.xpdlId)).size === activities.length;
  }, "duplicate activity xpdlId"),
  v.check(({ edgeList }) => {
    return new Set(edgeList.map((it) => it.id)).size === edgeList.length;
  }, "duplicate edge id"),
  v.check(({ edgeList }) => {
    const transitions = edgeList.filter((it) => it.type === "transitionEdge");
    return new Set(transitions.map((it) => it.xpdlId)).size === transitions.length;
  }, "duplicate edge xpdlId"),
  v.check(({ edgeList }) => {
    return edgeList.every((edge) => edge.fromNodeId !== edge.toNodeId);
  }, "nodeFromId and nodeToId of edge are equal"),
  v.check(({ edgeList, nodeList }) => {
    const activities = nodeList.filter((it) => it.type === "activityNode");
    const transitions = edgeList.filter((it) => it.type === "transitionEdge");
    return transitions.every((transition) =>
      activities.some(
        (activity) => transition.fromNodeId === activity.id || transition.toNodeId === activity.id,
      ),
    );
  }, "no activity referenced by transition"),
  v.check(({ edgeList, nodeList }) => {
    const activities = nodeList.filter((it) => it.type === "activityNode");
    const startNodes = nodeList.filter((it) => it.type === "startNode");
    const startEdges = edgeList.filter((it) => it.type === "startEdge");
    return startEdges.every(
      (startEdge) =>
        startNodes.some((startNode) => startEdge.fromNodeId === startNode.id) &&
        activities.some((activity) => startEdge.toNodeId === activity.id),
    );
  }, "no node referenced by start edge"),
  v.check(({ edgeList, nodeList }) => {
    const activities = nodeList.filter((it) => it.type === "activityNode");
    const endNodes = nodeList.filter((it) => it.type === "endNode");
    const endEdges = edgeList.filter((it) => it.type === "endEdge");
    return endEdges.every(
      (endEdge) =>
        activities.some((activity) => endEdge.fromNodeId === activity.id) &&
        endNodes.some((endNode) => endEdge.toNodeId === endNode.id),
    );
  }, "no node referenced by end edge"),
  v.check(({ nodeList, detail: { applications } }) => {
    const activities = nodeList.filter((it) => it.type === "activityNode");
    return activities.every((activity) =>
      activity.applications.every((activityApp) =>
        applications.some((application) => application.id === activityApp.id),
      ),
    );
  }, "no application id for activity"),
);

export const projectDetailEntitySchema = v.object({
  xpdlId: xpdlIdSchema,
  name: v.string(),
});

export const projectEntitySchema = v.pipe(
  v.object({
    created: dateTimeSchema,
    detail: projectDetailEntitySchema,
    processes: v.array(processEntitySchema),
  }),
  v.check(({ processes }) => {
    return new Set(processes.map((it) => it.id)).size === processes.length;
  }, "duplicate process id"),
);
