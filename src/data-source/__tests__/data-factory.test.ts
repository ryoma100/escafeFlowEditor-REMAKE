import { describe, expect, it } from "vitest";
import { ACTIVITY_MIN_WIDTH, NORMAL_ICON_SIZE } from "../../constants/app-const";
import { dataFactory } from "../data-factory";

describe("createProject", () => {
  it("one project", () => {
    const created = new Date().toISOString();
    expect(dataFactory.createProject(created)).toStrictEqual({
      created,
      detail: {
        name: "プロジェクト",
        xpdlId: "project",
      },
      processes: [
        {
          id: 1,
          created,
          detail: {
            xpdlId: "process-1",
            name: "プロセス1",
            validFrom: "",
            validTo: "",
            environments: [],
            applications: [],
          },
          actors: [
            {
              id: 1,
              name: "アクター1",
              xpdlId: "actor-1",
            },
          ],
          nodes: [],
          edges: [],
        },
      ],
    });
  });
});

describe("createProcess", () => {
  it("one process", () => {
    const created = new Date().toISOString();
    expect(dataFactory.createProcess([], created)).toStrictEqual({
      id: 1,
      created,
      detail: {
        xpdlId: "process-1",
        name: "プロセス1",
        validFrom: "",
        validTo: "",
        environments: [],
        applications: [],
      },
      actors: [
        {
          id: 1,
          name: "アクター1",
          xpdlId: "actor-1",
        },
      ],
      nodes: [],
      edges: [],
    });
  });

  it("two process", () => {
    const created = new Date().toISOString();
    const processes = dataFactory.createProcess([], created);
    expect(dataFactory.createProcess([processes], created)).toStrictEqual({
      id: 2,
      created,
      detail: {
        xpdlId: "process-2",
        name: "プロセス2",
        validFrom: "",
        validTo: "",
        environments: [],
        applications: [],
      },
      actors: [
        {
          id: 1,
          name: "アクター1",
          xpdlId: "actor-1",
        },
      ],
      nodes: [],
      edges: [],
    });
  });

  it("duplicate process", () => {
    const created = new Date().toISOString();
    const processes = dataFactory.createProcess([], created);
    processes.detail.xpdlId = "process-2";
    expect(dataFactory.createProcess([processes], created)).toStrictEqual({
      id: 3,
      created,
      detail: {
        xpdlId: "process-3",
        name: "プロセス3",
        validFrom: "",
        validTo: "",
        environments: [],
        applications: [],
      },
      actors: [
        {
          id: 1,
          name: "アクター1",
          xpdlId: "actor-1",
        },
      ],
      nodes: [],
      edges: [],
    });
  });
});

describe("createEnvironment", () => {
  it("one environment", () => {
    expect(dataFactory.createEnvironment([])).toStrictEqual({
      id: 1,
      name: "name1",
      value: "value1",
    });
  });

  it("two environment", () => {
    const environment = dataFactory.createEnvironment([]);
    expect(dataFactory.createEnvironment([environment])).toStrictEqual({
      id: 2,
      name: "name2",
      value: "value2",
    });
  });
});

describe("createApplication", () => {
  it("one application", () => {
    expect(dataFactory.createApplication([])).toStrictEqual({
      id: 1,
      xpdlId: "application-1",
      name: "name1",
      extendedName: "",
      extendedValue: "",
    });
  });

  it("two application", () => {
    const application = dataFactory.createApplication([]);
    expect(dataFactory.createApplication([application])).toStrictEqual({
      id: 2,
      xpdlId: "application-2",
      name: "name2",
      extendedName: "",
      extendedValue: "",
    });
  });

  it("duplicate application", () => {
    const application = dataFactory.createApplication([]);
    application.xpdlId = "application-2";
    expect(dataFactory.createApplication([application])).toStrictEqual({
      id: 3,
      xpdlId: "application-3",
      name: "name3",
      extendedName: "",
      extendedValue: "",
    });
  });
});

describe("createActorEntity", () => {
  it("one actor", () => {
    expect(dataFactory.createActorEntity([])).toStrictEqual({
      id: 1,
      xpdlId: "actor-1",
      name: "アクター1",
    });
  });

  it("two application", () => {
    const application = dataFactory.createActorEntity([]);
    expect(dataFactory.createActorEntity([application])).toStrictEqual({
      id: 2,
      xpdlId: "actor-2",
      name: "アクター2",
    });
  });

  it("duplicate application", () => {
    const application = dataFactory.createActorEntity([]);
    application.xpdlId = "actor-2";
    expect(dataFactory.createActorEntity([application])).toStrictEqual({
      id: 3,
      xpdlId: "actor-3",
      name: "アクター3",
    });
  });
});

describe("createActivityNode", () => {
  it("one activity", () => {
    expect(dataFactory.createActivityNode([], 1, "autoActivity", 11, 12)).toStrictEqual({
      id: 1,
      xpdlId: "activity-1",
      type: "activityNode",
      activityType: "autoActivity",
      name: "仕事1",
      actorId: 1,
      applications: [],
      ognl: "",
      joinType: "notJoin",
      splitType: "notSplit",
      x: 11 - ACTIVITY_MIN_WIDTH / 2,
      y: 12,
      width: ACTIVITY_MIN_WIDTH,
      height: 0,
      selected: false,
    });
  });

  it("two activity", () => {
    const activity = dataFactory.createActivityNode([], 1, "autoActivity", 0, 0);
    expect(dataFactory.createActivityNode([activity], 11, "manualActivity", 21, 22)).toStrictEqual({
      id: 2,
      xpdlId: "activity-2",
      type: "activityNode",
      activityType: "manualActivity",
      name: "仕事2",
      actorId: 11,
      applications: [],
      ognl: "",
      joinType: "notJoin",
      splitType: "notSplit",
      x: 21 - ACTIVITY_MIN_WIDTH / 2,
      y: 22,
      width: ACTIVITY_MIN_WIDTH,
      height: 0,
      selected: false,
    });
  });

  it("duplicate activity", () => {
    const activity = dataFactory.createActivityNode([], 1, "autoActivity", 0, 0);
    activity.xpdlId = "activity-2";
    expect(dataFactory.createActivityNode([activity], 21, "userActivity", 31, 32)).toStrictEqual({
      id: 2,
      xpdlId: "activity-3",
      type: "activityNode",
      activityType: "userActivity",
      name: "仕事3",
      actorId: 21,
      applications: [],
      ognl: "",
      joinType: "notJoin",
      splitType: "notSplit",
      x: 31 - ACTIVITY_MIN_WIDTH / 2,
      y: 32,
      width: ACTIVITY_MIN_WIDTH,
      height: 0,
      selected: false,
    });
  });
});

describe("createTransitionEdge", () => {
  it("one transition", () => {
    expect(dataFactory.createTransitionEdge([], 1, 2)).toStrictEqual({
      id: 1,
      xpdlId: "transition-1",
      type: "transitionEdge",
      fromNodeId: 1,
      toNodeId: 2,
      ognl: "",
      selected: false,
    });
  });

  it("two transition", () => {
    const transition = dataFactory.createTransitionEdge([], 1, 2);
    expect(dataFactory.createTransitionEdge([transition], 11, 12)).toStrictEqual({
      id: 2,
      xpdlId: "transition-2",
      type: "transitionEdge",
      fromNodeId: 11,
      toNodeId: 12,
      ognl: "",
      selected: false,
    });
  });

  it("duplicate transition", () => {
    const transition = dataFactory.createTransitionEdge([], 1, 2);
    transition.xpdlId = "transition-2";
    expect(dataFactory.createTransitionEdge([transition], 21, 22)).toStrictEqual({
      id: 2,
      xpdlId: "transition-3",
      type: "transitionEdge",
      fromNodeId: 21,
      toNodeId: 22,
      ognl: "",
      selected: false,
    });
  });
});

describe("createCommentNode", () => {
  it("one comment-node", () => {
    expect(dataFactory.createCommentNode([], 1, 2)).toStrictEqual({
      id: 1,
      type: "commentNode",
      comment: "コメント",
      x: 1,
      y: 2,
      width: 0,
      height: 0,
      selected: false,
    });
  });

  it("two comment-node", () => {
    const node = dataFactory.createCommentNode([], 1, 2);
    expect(dataFactory.createCommentNode([node], 11, 12)).toStrictEqual({
      id: 2,
      type: "commentNode",
      comment: "コメント",
      x: 11,
      y: 12,
      width: 0,
      height: 0,
      selected: false,
    });
  });
});

describe("createCommentEdge", () => {
  it("one comment-edge", () => {
    expect(dataFactory.createCommentEdge([], 1, 2)).toStrictEqual({
      id: 1,
      type: "commentEdge",
      fromNodeId: 1,
      toNodeId: 2,
      selected: false,
    });
  });

  it("two comment-edge", () => {
    const edge = dataFactory.createCommentEdge([], 1, 2);
    expect(dataFactory.createCommentEdge([edge], 11, 12)).toStrictEqual({
      id: 2,
      type: "commentEdge",
      fromNodeId: 11,
      toNodeId: 12,
      selected: false,
    });
  });
});

describe("createStartNode", () => {
  it("one start-node", () => {
    expect(dataFactory.createStartNode([], 1, 2)).toStrictEqual({
      id: 1,
      type: "startNode",
      x: 1,
      y: 2,
      width: NORMAL_ICON_SIZE,
      height: NORMAL_ICON_SIZE,
      selected: false,
    });
  });

  it("two start-node", () => {
    const node = dataFactory.createStartNode([], 1, 2);
    expect(dataFactory.createStartNode([node], 11, 12)).toStrictEqual({
      id: 2,
      type: "startNode",
      x: 11,
      y: 12,
      width: NORMAL_ICON_SIZE,
      height: NORMAL_ICON_SIZE,
      selected: false,
    });
  });
});

describe("createStartEdge", () => {
  it("one start-edge", () => {
    expect(dataFactory.createStartEdge([], 1, 2)).toStrictEqual({
      id: 1,
      type: "startEdge",
      fromNodeId: 1,
      toNodeId: 2,
      selected: false,
    });
  });

  it("two start-edge", () => {
    const edge = dataFactory.createStartEdge([], 1, 2);
    expect(dataFactory.createStartEdge([edge], 11, 12)).toStrictEqual({
      id: 2,
      type: "startEdge",
      fromNodeId: 11,
      toNodeId: 12,
      selected: false,
    });
  });
});

describe("createEndNode", () => {
  it("one end-node", () => {
    expect(dataFactory.createEndNode([], 1, 2)).toStrictEqual({
      id: 1,
      type: "endNode",
      x: 1,
      y: 2,
      width: NORMAL_ICON_SIZE,
      height: NORMAL_ICON_SIZE,
      selected: false,
    });
  });

  it("two end-node", () => {
    const node = dataFactory.createEndNode([], 1, 2);
    expect(dataFactory.createEndNode([node], 11, 12)).toStrictEqual({
      id: 2,
      type: "endNode",
      x: 11,
      y: 12,
      width: NORMAL_ICON_SIZE,
      height: NORMAL_ICON_SIZE,
      selected: false,
    });
  });
});

describe("createEndEdge", () => {
  it("one end-edge", () => {
    expect(dataFactory.createEndEdge([], 1, 2)).toStrictEqual({
      id: 1,
      type: "endEdge",
      fromNodeId: 1,
      toNodeId: 2,
      selected: false,
    });
  });

  it("two end-edge", () => {
    const edge = dataFactory.createEndEdge([], 1, 2);
    expect(dataFactory.createEndEdge([edge], 11, 12)).toStrictEqual({
      id: 2,
      type: "endEdge",
      fromNodeId: 11,
      toNodeId: 12,
      selected: false,
    });
  });
});
