import { describe, expect, it } from "vitest";
import { exportXml, importXml } from "../data-converter";
import { dataFactory } from "../data-factory";
import { ActivityNode, CommentNode } from "../data-type";

describe("exportXml", () => {
  it("init project", () => {
    expect(exportXml(initProjectData)).toEqual(initProjectXml);
  });
  it("one process", () => {
    expect(exportXml(oneProcessData)).toEqual(oneProcessXml);
  });
});

describe("importXml", () => {
  it("init project", () => {
    expect(importXml(initProjectXml)).toStrictEqual(initProjectData);
  });
  it("one process", () => {
    expect(importXml(oneProcessXml)).toStrictEqual(oneProcessData);
  });
});

const initProjectData = dataFactory.createProject("0001-01-01T00:00:00.000Z");
const initProjectXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<Package xmlns="http://www.wfmc.org/2002/XPDL1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Id="project" Name="プロジェクト" xsi:schemaLocation="http://www.wfmc.org/2002/XPDL1.0 http://wfmc.org/standards/docs/TC-1025_schema_10_xpdl.xsd">
  <PackageHeader>
    <XPDLVersion>1.0</XPDLVersion>
    <Vendor>escafe.org</Vendor>
    <Created>0001-01-01T00:00:00.000Z</Created>
  </PackageHeader>
  <WorkflowProcesses>
    <WorkflowProcess Id="process-1" Name="プロセス1">
      <ProcessHeader>
        <Created>0001-01-01T00:00:00.000Z</Created>
        <ValidFrom></ValidFrom>
        <ValidTo></ValidTo>
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
`;

/**
 * start,manualTimerActivity#3 -> (oneJoin)manualActivity#1(oneSplit) -> autoActivity#2
 * manualActivity#1,UserActivity#5 -> (xorJoin)autoActivity#2(xorSplit) -> manualTimerActivity#3
 * autoActivity#2 -> (oneJoin)manualTimerActivity#3(andSplit) -> manualActivity#1,autoTimerActivity#4
 * autoActivity#2,manualTimerActivity#2 -> (andJoin)autoTimerActivity#4(oneSplit) -> userActivity#5
 * autoTimerActivity#3,comment -> (oneJoin)userActivity#5(oneSplit) -> autoActivity#2,end
 */
const oneProcessData = (function () {
  const project = dataFactory.createProject("0001-01-01T00:00:00.000Z");
  const process = project.processes[0];
  process.detail.applications.push(dataFactory.createApplication(process.detail.applications));
  const application1 = process.detail.applications[0];
  application1.name = "app1";
  application1.extendedName = "extName1";
  application1.extendedValue = "extValue1";
  process.actors.push(dataFactory.createActorEntity(process.actors));
  const actor1 = process.actors[0];
  const actor2 = process.actors[1];

  process.nodes.push(
    dataFactory.createActivityNode(process.nodes, actor1.id, "manualActivity", 11, 12),
  );
  const manualActivity = process.nodes[0] as ActivityNode;
  process.nodes.push(
    dataFactory.createActivityNode(process.nodes, actor2.id, "autoActivity", 21, 22),
  );
  const autoActivity = process.nodes[1] as ActivityNode;
  process.nodes.push(
    dataFactory.createActivityNode(process.nodes, actor1.id, "manualTimerActivity", 31, 32),
  );
  const manualTimerActivity = process.nodes[2] as ActivityNode;
  process.nodes.push(
    dataFactory.createActivityNode(process.nodes, actor2.id, "autoTimerActivity", 41, 42),
  );
  const autoTimerActivity = process.nodes[3] as ActivityNode;
  process.nodes.push(
    dataFactory.createActivityNode(process.nodes, actor1.id, "userActivity", 51, 52),
  );
  const userActivity = process.nodes[4] as ActivityNode;

  process.nodes.push(dataFactory.createStartNode(process.nodes, 10, 11));
  const startNode = process.nodes[5];
  process.nodes.push(dataFactory.createEndNode(process.nodes, 61, 62));
  const endNode = process.nodes[6];
  process.nodes.push(dataFactory.createCommentNode(process.nodes, 71, 72));
  const commentNode = process.nodes[7] as CommentNode;

  process.edges.push(
    dataFactory.createTransitionEdge(process.edges, manualTimerActivity.id, manualActivity.id),
  );
  process.edges.push(
    dataFactory.createTransitionEdge(process.edges, manualActivity.id, autoActivity.id),
  );
  process.edges.push(
    dataFactory.createTransitionEdge(process.edges, userActivity.id, autoActivity.id),
  );
  process.edges.push(
    dataFactory.createTransitionEdge(process.edges, autoActivity.id, manualTimerActivity.id),
  );
  process.edges.push(
    dataFactory.createTransitionEdge(process.edges, autoActivity.id, autoTimerActivity.id),
  );
  process.edges.push(
    dataFactory.createTransitionEdge(process.edges, manualTimerActivity.id, autoTimerActivity.id),
  );
  process.edges.push(
    dataFactory.createTransitionEdge(process.edges, autoTimerActivity.id, userActivity.id),
  );
  manualActivity.joinType = "oneJoin";
  manualActivity.splitType = "oneSplit";
  autoActivity.joinType = "xorJoin";
  autoActivity.splitType = "xorSplit";
  manualTimerActivity.joinType = "oneJoin";
  manualTimerActivity.splitType = "andSplit";
  autoTimerActivity.joinType = "andJoin";
  autoTimerActivity.splitType = "oneSplit";
  userActivity.joinType = "oneJoin";
  userActivity.splitType = "oneSplit";

  process.edges.push(dataFactory.createStartEdge(process.edges, startNode.id, manualActivity.id));
  process.edges.push(dataFactory.createEndEdge(process.edges, userActivity.id, endNode.id));
  process.edges.push(dataFactory.createCommentEdge(process.edges, commentNode.id, userActivity.id));

  return project;
})();
const oneProcessXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<Package xmlns="http://www.wfmc.org/2002/XPDL1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Id="project" Name="プロジェクト" xsi:schemaLocation="http://www.wfmc.org/2002/XPDL1.0 http://wfmc.org/standards/docs/TC-1025_schema_10_xpdl.xsd">
  <PackageHeader>
    <XPDLVersion>1.0</XPDLVersion>
    <Vendor>escafe.org</Vendor>
    <Created>0001-01-01T00:00:00.000Z</Created>
  </PackageHeader>
  <WorkflowProcesses>
    <WorkflowProcess Id="process-1" Name="プロセス1">
      <ProcessHeader>
        <Created>0001-01-01T00:00:00.000Z</Created>
        <ValidFrom></ValidFrom>
        <ValidTo></ValidTo>
      </ProcessHeader>
      <Participants>
        <Participant Id="actor-1" Name="アクター1">
          <ParticipantType Type="ROLE"></ParticipantType>
        </Participant>
        <Participant Id="actor-2" Name="アクター2">
          <ParticipantType Type="ROLE"></ParticipantType>
        </Participant>
      </Participants>
      <Applications>
        <Application Id="application-1" Name="app1">
          <ExtendedAttributes>
            <ExtendedAttribute Name="extName1" Value="extValue1"></ExtendedAttribute>
          </ExtendedAttributes>
        </Application>
      </Applications>
      <Activities>
        <Activity Id="activity-1" Name="仕事1">
          <Implementation>
            <No/>
          </Implementation>
          <Performer>actor-1</Performer>
          <FinishMode>
            <Manual/>
          </FinishMode>
          <TransitionRestrictions>
            <TransitionRestriction></TransitionRestriction>
          </TransitionRestrictions>
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_PARTICIPANT_ID" Value="actor-1"></ExtendedAttribute>
            <ExtendedAttribute Name="JaWE_GRAPH_OFFSET" Value="-39,12"></ExtendedAttribute>
            <ExtendedAttribute Name="BURI_GRAPH_RECTANGLE" Value="-39,12,100,0"></ExtendedAttribute>
          </ExtendedAttributes>
        </Activity>
        <Activity Id="activity-2" Name="仕事2">
          <Implementation>
            <No/>
          </Implementation>
          <Performer>actor-2</Performer>
          <FinishMode>
            <Automatic/>
          </FinishMode>
          <TransitionRestrictions>
            <TransitionRestriction>
              <Join Type="XOR">
                <TransitionRefs>
                  <TransitionRef Id="transition-2"></TransitionRef>
                  <TransitionRef Id="transition-3"></TransitionRef>
                </TransitionRefs>
              </Join>
              <Split Type="XOR">
                <TransitionRefs>
                  <TransitionRef Id="transition-4"></TransitionRef>
                  <TransitionRef Id="transition-5"></TransitionRef>
                </TransitionRefs>
              </Split>
            </TransitionRestriction>
          </TransitionRestrictions>
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_PARTICIPANT_ID" Value="actor-2"></ExtendedAttribute>
            <ExtendedAttribute Name="JaWE_GRAPH_OFFSET" Value="-29,22"></ExtendedAttribute>
            <ExtendedAttribute Name="BURI_GRAPH_RECTANGLE" Value="-29,22,100,0"></ExtendedAttribute>
          </ExtendedAttributes>
        </Activity>
        <Activity Id="activity-3" Name="仕事3">
          <Implementation>
            <No/>
          </Implementation>
          <Performer>actor-1</Performer>
          <FinishMode>
            <Manual/>
          </FinishMode>
          <Limit></Limit>
          <TransitionRestrictions>
            <TransitionRestriction>
              <Split Type="AND">
                <TransitionRefs>
                  <TransitionRef Id="transition-1"></TransitionRef>
                  <TransitionRef Id="transition-6"></TransitionRef>
                </TransitionRefs>
              </Split>
            </TransitionRestriction>
          </TransitionRestrictions>
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_PARTICIPANT_ID" Value="actor-1"></ExtendedAttribute>
            <ExtendedAttribute Name="JaWE_GRAPH_OFFSET" Value="-19,32"></ExtendedAttribute>
            <ExtendedAttribute Name="BURI_GRAPH_RECTANGLE" Value="-19,32,100,0"></ExtendedAttribute>
          </ExtendedAttributes>
        </Activity>
        <Activity Id="activity-4" Name="仕事4">
          <Implementation>
            <No/>
          </Implementation>
          <Performer>actor-2</Performer>
          <FinishMode>
            <Automatic/>
          </FinishMode>
          <Limit></Limit>
          <TransitionRestrictions>
            <TransitionRestriction>
              <Join Type="AND">
                <TransitionRefs>
                  <TransitionRef Id="transition-5"></TransitionRef>
                  <TransitionRef Id="transition-6"></TransitionRef>
                </TransitionRefs>
              </Join>
            </TransitionRestriction>
          </TransitionRestrictions>
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_PARTICIPANT_ID" Value="actor-2"></ExtendedAttribute>
            <ExtendedAttribute Name="JaWE_GRAPH_OFFSET" Value="-9,42"></ExtendedAttribute>
            <ExtendedAttribute Name="BURI_GRAPH_RECTANGLE" Value="-9,42,100,0"></ExtendedAttribute>
          </ExtendedAttributes>
        </Activity>
        <Activity Id="activity-5" Name="仕事5">
          <Implementation>
            <No/>
          </Implementation>
          <Performer>actor-1</Performer>
          <TransitionRestrictions>
            <TransitionRestriction></TransitionRestriction>
          </TransitionRestrictions>
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_PARTICIPANT_ID" Value="actor-1"></ExtendedAttribute>
            <ExtendedAttribute Name="JaWE_GRAPH_OFFSET" Value="1,52"></ExtendedAttribute>
            <ExtendedAttribute Name="BURI_GRAPH_RECTANGLE" Value="1,52,100,0"></ExtendedAttribute>
          </ExtendedAttributes>
        </Activity>
      </Activities>
      <Transitions>
        <Transition From="activity-3" Id="transition-1" To="activity-1">
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_TRANSITION_STYLE" Value="NO_ROUTING_SPLINE"></ExtendedAttribute>
          </ExtendedAttributes>
        </Transition>
        <Transition From="activity-1" Id="transition-2" To="activity-2">
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_TRANSITION_STYLE" Value="NO_ROUTING_SPLINE"></ExtendedAttribute>
          </ExtendedAttributes>
        </Transition>
        <Transition From="activity-5" Id="transition-3" To="activity-2">
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_TRANSITION_STYLE" Value="NO_ROUTING_SPLINE"></ExtendedAttribute>
          </ExtendedAttributes>
        </Transition>
        <Transition From="activity-2" Id="transition-4" To="activity-3">
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_TRANSITION_STYLE" Value="NO_ROUTING_SPLINE"></ExtendedAttribute>
          </ExtendedAttributes>
        </Transition>
        <Transition From="activity-2" Id="transition-5" To="activity-4">
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_TRANSITION_STYLE" Value="NO_ROUTING_SPLINE"></ExtendedAttribute>
          </ExtendedAttributes>
        </Transition>
        <Transition From="activity-3" Id="transition-6" To="activity-4">
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_TRANSITION_STYLE" Value="NO_ROUTING_SPLINE"></ExtendedAttribute>
          </ExtendedAttributes>
        </Transition>
        <Transition From="activity-4" Id="transition-7" To="activity-5">
          <ExtendedAttributes>
            <ExtendedAttribute Name="JaWE_GRAPH_TRANSITION_STYLE" Value="NO_ROUTING_SPLINE"></ExtendedAttribute>
          </ExtendedAttributes>
        </Transition>
      </Transitions>
      <ExtendedAttributes>
        <ExtendedAttribute Name="JaWE_GRAPH_WORKFLOW_PARTICIPANT_ORDER" Value="actor-1;actor-2"></ExtendedAttribute>
      </ExtendedAttributes>
    </WorkflowProcess>
  </WorkflowProcesses>
  <ExtendedAttributes>
    <ExtendedAttribute Name="EDITING_TOOL" Value="EscafeFlow Editor"></ExtendedAttribute>
    <ExtendedAttribute Name="EDITING_TOOL_VERSION" Value="0.2.0"></ExtendedAttribute>
  </ExtendedAttributes>
</Package>
`;
