import { describe, expect, it } from "vitest";
import { exportYaml } from "../data-converter";
import { dataFactory } from "../data-factory";

describe("exportYaml", () => {
  it("init project", () => {
    const created = new Date().toISOString();
    const project = dataFactory.createProject(created);
    expect(exportYaml(project)).toEqual(`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<Package xmlns="http://www.wfmc.org/2002/XPDL1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Id="project" Name="プロジェクト" xsi:schemaLocation="http://www.wfmc.org/2002/XPDL1.0 http://wfmc.org/standards/docs/TC-1025_schema_10_xpdl.xsd">
  <PackageHeader>
    <XPDLVersion>1.0</XPDLVersion>
    <Vendor>escafe.org</Vendor>
    <Created>${created}</Created>
  </PackageHeader>
  <WorkflowProcesses>
    <WorkflowProcess Id="process-1" Name="プロセス1">
      <ProcessHeader>
        <Created>${created}</Created>
      </ProcessHeader>
      <Participants>
        <Participant Id="actor-1" Name="アクター1">
          <ParticipantType Type="ROLE"></ParticipantType>
        </Participant>
      </Participants>
      <Applications></Applications>
      <Activities></Activities>
      <Transitions></Transitions>
      <ExtendedAttributes>
        <ExtendedAttribute Name="JaWE_GRAPH_WORKFLOW_PARTICIPANT_ORDER" Value="actor-1"></ExtendedAttribute>
      </ExtendedAttributes>
    </WorkflowProcess>
  </WorkflowProcesses>
  <ExtendedAttributes>
    <ExtendedAttribute Name="EDITING_TOOL" Value="EscafeFlow Editor"></ExtendedAttribute>
    <ExtendedAttribute Name="EDITING_TOOL_VERSION" Value="0.2.0"></ExtendedAttribute>
  </ExtendedAttributes>
</Package>
`);
  });
});
