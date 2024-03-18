import { XMLBuilder } from "fast-xml-parser";
import { ActivityNode, ActorEntity, ProjectEntity, TransitionEdge } from "./data-type";

const alwaysArray = [
  "WorkflowProcesses.WorkflowProcess",
  "WorkflowProcesses.WorkflowProcess.Participants.Participant",
  "WorkflowProcesses.WorkflowProcess.Applications.Application",
  "WorkflowProcesses.WorkflowProcess.Activities.Activity",
  "WorkflowProcesses.WorkflowProcess.Activities.Activity.TransitionRestrictions.TransitionRestriction",
  "WorkflowProcesses.WorkflowProcess.Activities.Activity.TransitionRestrictions.TransitionRestriction.Split.TransitionRefs.TransitionRef",
  "WorkflowProcesses.WorkflowProcess.Activities.Activity.ExtendedAttributes.ExtendedAttribute",
  "ExtendedAttributes.ExtendedAttribute",
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
// const xp = new XMLParser(fxpOption);
const xb = new XMLBuilder(fxpOption);

export function exportYaml(project: ProjectEntity): string {
  const obj = {
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
            ProcessHeader: { Created: process.created },
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
                                "@_Id": (
                                  process.nodes.find(
                                    (fromActivity) => fromActivity.id === transition.id,
                                  ) as ActivityNode
                                ).xpdlId,
                              },
                            })),
                        },
                      }
                    : {};
                const split =
                  activity.splitType === "xorSplit" || activity.splitType === "andSplit"
                    ? {
                        Join: {
                          "@_Type": activity.splitType === "xorSplit" ? "XOR" : "AND",
                          TransitionRefs: process.edges
                            .filter(
                              (it) => it.type === "transitionEdge" && it.fromNodeId === activity.id,
                            )
                            .map((transition) => ({
                              TransitionRef: {
                                "@_Id": (
                                  process.nodes.find(
                                    (toActivity) => toActivity.id === transition.id,
                                  ) as ActivityNode
                                ).xpdlId,
                              },
                            })),
                        },
                      }
                    : {};
                return {
                  Activity: {
                    "@_Id": activity.xpdlId,
                    "@_Name": activity.name,
                    Implementation: { No: null },
                    Performer: activity.xpdlId,
                    FinishMode: { Manual: null },
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
                    "@_from": (
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

  const xmlContent = xb.build(obj);
  return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + xmlContent;
}

export function importYaml() {
  //
}

export function deepCopy<T extends object>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
