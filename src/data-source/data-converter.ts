import { XMLBuilder } from "fast-xml-parser";
import { ProjectEntity } from "./data-type";

const alwaysArray = [
  "WorkflowProcesses",
  "WorkflowProcesses.WorkflowProcess.Participants",
  "WorkflowProcesses.WorkflowProcess.Applications",
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
      "@_Id": project.xpdlId,
      "@_Name": project.name,
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
            Applications: process.detail.applications.map((app) => {
              return {
                Application: {
                  "@_Id": app.xpdlId,
                  "@_Name": app.name,
                  ExtendedAttributes: {
                    ExtendedAttribute: { "@_Name": app.extendedName, "@_Value": app.extendedValue },
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
