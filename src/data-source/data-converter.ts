/* eslint-disable @typescript-eslint/ban-ts-comment */
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import {
  ActivityJoinType,
  ActivityNode,
  ActivityNodeType,
  ActivitySplitType,
  ActorEntity,
  ApplicationEntity,
  ProcessDetailEntity,
  ProjectEntity,
  Rectangle,
  TransitionEdge,
} from "./data-type";

const alwaysArray = [
  "Package.WorkflowProcesses.WorkflowProcess",
  "Package.WorkflowProcesses.WorkflowProcess.Participants.Participant",
  "Package.WorkflowProcesses.WorkflowProcess.Applications.Application",
  "Package.WorkflowProcesses.WorkflowProcess.Activities.Activity.",
  "Package.WorkflowProcesses.WorkflowProcess.Activities.Activity.Implementation.Tool",
  "Package.WorkflowProcesses.WorkflowProcess.Activities.Activity.ExtendedAttributes.ExtendedAttribute",
  "Package.ExtendedAttributes.ExtendedAttribute",
];

const fxpOption = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  oneListGroup: true,
  isArray: (_name: string, path: string, _isLeafNode: boolean, _isAttribute: boolean) => {
    return alwaysArray.includes(path);
  },
};
const xp = new XMLParser(fxpOption);
const xb = new XMLBuilder(fxpOption);

export function exportXml(project: ProjectEntity): string {
  const xmlObject = {
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8", "@_standalone": "no" },
    Package: {
      "@_xmlns": "http://www.wfmc.org/2002/XPDL1.0",
      "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@_Id": project.detail.xpdlId,
      "@_Name": project.detail.name,
      "@_xsi:schemaLocation":
        "http://www.wfmc.org/2002/XPDL1.0 http://wfmc.org/standards/docs/TC-1025_schema_10_xpdl.xsd",
      PackageHeader: {
        XPDLVersion: "1.0",
        Vendor: "escafe.org",
        Created: project.created,
      },
      WorkflowProcesses: project.processes.map((process) => {
        return {
          WorkflowProcess: {
            "@_Id": process.detail.xpdlId,
            "@_Name": process.detail.name,
            ProcessHeader: {
              Created: process.created,
              ValidFrom: process.detail.validFrom,
              ValidTo: process.detail.validTo,
            },
            Participants: process.actors.map((actor) => ({
              Participant: {
                "@_Id": actor.xpdlId,
                "@_Name": actor.name,
                ParticipantType: { "@_Type": "ROLE" },
              },
            })),
            Applications: process.detail.applications.map((app) => ({
              Application: {
                "@_Id": app.xpdlId,
                "@_Name": app.name,
                ExtendedAttributes: {
                  ExtendedAttribute: { "@_Name": app.extendedName, "@_Value": app.extendedValue },
                },
              },
            })),
            Activities: process.nodes
              .filter((it) => it.type === "activityNode")
              .map((it) => {
                const activity = it as ActivityNode;
                const join =
                  activity.joinType === "xorJoin" || activity.joinType === "andJoin"
                    ? {
                        Join: {
                          "@_Type": activity.joinType === "xorJoin" ? "XOR" : "AND",
                          TransitionRefs: process.edges
                            .filter(
                              (it) => it.type === "transitionEdge" && it.toNodeId === activity.id,
                            )
                            .map((transition) => ({
                              TransitionRef: {
                                "@_Id": (transition as TransitionEdge).xpdlId,
                              },
                            })),
                        },
                      }
                    : {};
                const split =
                  activity.splitType === "xorSplit" || activity.splitType === "andSplit"
                    ? {
                        Split: {
                          "@_Type": activity.splitType === "xorSplit" ? "XOR" : "AND",
                          TransitionRefs: process.edges
                            .filter(
                              (it) => it.type === "transitionEdge" && it.fromNodeId === activity.id,
                            )
                            .map((transition) => ({
                              TransitionRef: {
                                "@_Id": (transition as TransitionEdge).xpdlId,
                              },
                            })),
                        },
                      }
                    : {};
                const finishMode =
                  activity.activityType === "manualActivity" ||
                  activity.activityType === "manualTimerActivity"
                    ? { FinishMode: { Manual: null } }
                    : activity.activityType === "autoActivity" ||
                        activity.activityType === "autoTimerActivity"
                      ? { FinishMode: { Automatic: null } }
                      : {};
                const limit =
                  activity.activityType === "manualTimerActivity" ||
                  activity.activityType === "autoTimerActivity"
                    ? {
                        Limit: { "#text": activity.ognl },
                      }
                    : {};

                return {
                  Activity: {
                    "@_Id": activity.xpdlId,
                    "@_Name": activity.name,
                    Implementation: { No: null },
                    Performer: process.actors.find((it) => it.id === activity.actorId)!.xpdlId,
                    ...finishMode,
                    ...limit,
                    TransitionRestrictions: {
                      TransitionRestriction: {
                        ...join,
                        ...split,
                      },
                    },
                    ExtendedAttributes: [
                      {
                        ExtendedAttribute: {
                          "@_Name": "JaWE_GRAPH_PARTICIPANT_ID",
                          "@_Value": (
                            process.actors.find((it) => it.id === activity.actorId) as ActorEntity
                          ).xpdlId,
                        },
                      },
                      {
                        ExtendedAttribute: {
                          "@_Name": "JaWE_GRAPH_OFFSET",
                          "@_Value": `${activity.x},${activity.y}`,
                        },
                      },
                      {
                        ExtendedAttribute: {
                          "@_Name": "BURI_GRAPH_RECTANGLE",
                          "@_Value": `${activity.x},${activity.y},${activity.width},${activity.height}`,
                        },
                      },
                    ],
                  },
                };
              }),
            Transitions: process.edges
              .filter((it) => it.type === "transitionEdge")
              .map((it) => {
                const transition = it as TransitionEdge;
                const condition =
                  transition.ognl !== ""
                    ? {
                        Condition: {
                          "@_Type": "CONDITION",
                          "#text": transition.ognl,
                        },
                      }
                    : {};
                return {
                  Transition: {
                    "@_From": (
                      process.nodes.find(
                        (it) => it.type === "activityNode" && it.id === transition.fromNodeId,
                      ) as ActivityNode
                    ).xpdlId,
                    "@_Id": transition.xpdlId,
                    "@_To": (
                      process.nodes.find(
                        (it) => it.type === "activityNode" && it.id === transition.toNodeId,
                      ) as ActivityNode
                    ).xpdlId,
                    ...condition,
                    ExtendedAttributes: {
                      ExtendedAttribute: {
                        "@_Name": "JaWE_GRAPH_TRANSITION_STYLE",
                        "@_Value": "NO_ROUTING_SPLINE",
                      },
                    },
                  },
                };
              }),
            ExtendedAttributes: {
              ExtendedAttribute: {
                "@_Name": "JaWE_GRAPH_WORKFLOW_PARTICIPANT_ORDER",
                "@_Value": process.actors.map((it) => it.xpdlId).join(";"),
              },
            },
          },
        };
      }),
      ExtendedAttributes: [
        { ExtendedAttribute: { "@_Name": "EDITING_TOOL", "@_Value": "EscafeFlow Editor" } },
        { ExtendedAttribute: { "@_Name": "EDITING_TOOL_VERSION", "@_Value": "0.2.0" } },
      ],
    },
  };
  const xmlString = xb.build(xmlObject);
  return xmlString;
}

export function importXml(xmlString: string): ProjectEntity {
  const xml = xp.parse(xmlString);

  const project: ProjectEntity = {
    created: xml.Package.PackageHeader.Created,
    detail: {
      xpdlId: xml.Package["@_Id"],
      name: xml.Package["@_Name"],
    },
    // @ts-ignore
    processes: xml.Package.WorkflowProcesses.WorkflowProcess.map((process, processIdx) => {
      const applications: ApplicationEntity[] = (process.Applications.Application || []).map(
        // @ts-ignore
        (app, appIdx) => ({
          id: appIdx + 1,
          xpdlId: app["@_Id"],
          name: app["@_Name"],
          extendedName: app.ExtendedAttributes.ExtendedAttribute["@_Name"],
          extendedValue: app.ExtendedAttributes.ExtendedAttribute["@_Value"],
        }),
      );
      const detail: ProcessDetailEntity = {
        xpdlId: process["@_Id"],
        name: process["@_Name"],
        validFrom: process.ProcessHeader.ValidFrom,
        validTo: process.ProcessHeader.ValidTo,
        environments: [], // TODO
        applications,
      };
      const actors: ActorEntity[] = process.Participants.Participant.map(
        // @ts-ignore
        (actor, actorIdx) => ({
          id: actorIdx + 1,
          xpdlId: actor["@_Id"],
          name: actor["@_Name"],
        }),
      );
      const activityList: ActivityNode[] = (process.Activities.Activity || []).map(
        // @ts-ignore
        (activity, activityIdx) => {
          return {
            id: activityIdx + 1,
            type: "activityNode",
            activityType: parseActivityType(activity),
            xpdlId: activity["@_Id"],
            actorId: actors.find((it) => it.xpdlId === activity.Performer)!.id,
            name: activity["@_Name"],
            applications: parseActivityApplication(activity, applications),
            ognl: activity.Limit?.["#text"] ?? "",
            joinType: parseActivityJoinType(activity, process.Transitions.Transition || []),
            splitType: parseActivitySplitType(activity, process.Transitions.Transition || []),
            ...parseActivityRectangle(activity),
            selected: false,
          };
        },
      );
      const transitionList: TransitionEdge[] = (process.Transitions.Transition || []).map(
        // @ts-ignore
        (transition, transitionIdx) => {
          return {
            id: transitionIdx + 1,
            type: "transitionEdge",
            xpdlId: transition["@_Id"],
            ognl: transition.Condition ?? "",
            fromNodeId: activityList.find((it) => it.xpdlId === transition["@_From"])!.id,
            toNodeId: activityList.find((it) => it.xpdlId === transition["@_To"])!.id,
            selected: false,
          };
        },
      );

      return {
        id: processIdx + 1,
        created: process.ProcessHeader.Created,
        detail,
        actors,
        nodes: activityList,
        edges: transitionList,
      };
    }),
  };

  return project;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseActivityType(activity: any): ActivityNodeType {
  const isLimit = "Limit" in activity;
  const isManual = "Manual" in (activity.FinishMode ?? {});
  const isAutomatic = "Automatic" in (activity.FinishMode ?? {});

  switch (true) {
    case isManual && !isLimit:
      return "manualActivity";
    case isManual && isLimit:
      return "manualTimerActivity";
    case isAutomatic && !isLimit:
      return "autoActivity";
    case isAutomatic && isLimit:
      return "autoTimerActivity";
    default:
      return "userActivity";
  }
}

function parseActivityApplication(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activity: any,
  applications: ApplicationEntity[],
): ActivityNode["applications"] {
  return (activity.Implementation.Tool || []).map(
    // @ts-ignore
    (tool: toolIdx) => ({
      id: applications.find(
        (it) => it.name === tool.ExtendedAttributes.ExtendedAttribute["@_Name"],
      )!.id,
      ognl: tool.ExtendedAttributes.ExtendedAttribute["@_Value"],
    }),
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseActivityJoinType(activity: any, transactionList: any[]): ActivityJoinType {
  const count = transactionList.filter((it) => it["@_To"] === activity["@_Id"]).length;
  switch (count) {
    case 0:
      return "notJoin";
    case 1:
      return "oneJoin";
    default:
      return activity.TransitionRestrictions.TransitionRestriction?.Join["@_Type"] === "AND"
        ? "andJoin"
        : "xorJoin";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseActivitySplitType(activity: any, transactionList: any[]): ActivitySplitType {
  const count = transactionList.filter((it) => it["@_From"] === activity["@_Id"]).length;
  switch (count) {
    case 0:
      return "notSplit";
    case 1:
      return "oneSplit";
    default:
      return activity.TransitionRestrictions.TransitionRestriction?.Split["@_Type"] === "AND"
        ? "andSplit"
        : "xorSplit";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseActivityRectangle(activity: any): Rectangle {
  const attr = (activity.ExtendedAttributes.ExtendedAttribute as []).find(
    (it) => it["@_Name"] === "BURI_GRAPH_RECTANGLE",
  )!;
  const rect = (attr["@_Value"] as string).split(",");
  return {
    x: Number(rect[0]),
    y: Number(rect[1]),
    width: Number(rect[2]),
    height: Number(rect[3]),
  };
}

export function deepCopy<T extends object>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
