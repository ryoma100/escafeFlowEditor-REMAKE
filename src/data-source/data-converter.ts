import { XMLBuilder } from "fast-xml-parser";
import { ActivityNode, ProjectEntity } from "./data-type";

const alwaysArray = [
  "WorkflowProcesses",
  "WorkflowProcesses.WorkflowProcess.Participants",
  "WorkflowProcesses.WorkflowProcess.Applications",
  "WorkflowProcesses.WorkflowProcess.Activities",
  "WorkflowProcesses.WorkflowProcess.Activities.Activity.TransitionRestrictions",
  "WorkflowProcesses.WorkflowProcess.Activities.Activity.TransitionRestrictions.TransitionRestriction.Split.TransitionRefs",
  "WorkflowProcesses.WorkflowProcess.Activities.Activity.ExtendedAttributes",
];

const fxpOption = {
  ignoreAttributes: false,
  format: true,
  isArray: (_name: string, path: string) => alwaysArray.includes(path),
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
        Vendor: "guilab.jp",
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
                return {
                  Activity: {
                    "@_Id": activity.xpdlId,
                    "@_Name": activity.name,
                    Implementation: { No: null },
                    Performer: activity.xpdlId,
                    FinishMode: { Manual: null },
                    TransitionRestrictions: {
                      TransitionRestriction: {
                        Split: {
                          "@_Type": "XOR",
                          TransitionRefs: [
                            { TransitionRef: { "@_Id": "newpkg_wp1_act2" } },
                            { TransitionRef: { "@_Id": "newpkg_wp1_act3" } },
                          ],
                        },
                      },
                    },
                  },
                };
              }),
          },
        };
      }),
    },
  };

  const xmlContent = xb.build(obj);
  return xmlContent;
}

export function importYaml() {
  //
}

export function deepCopy<T extends object>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
