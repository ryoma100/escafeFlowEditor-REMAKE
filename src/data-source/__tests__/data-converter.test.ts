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
  it("two process", () => {
    expect(exportXml(twoProcessData)).toEqual(twoProcessXml);
  });
});

describe("importXml", () => {
  it("init project", () => {
    expect(importXml(initProjectXml)).toStrictEqual(initProjectData);
  });
  it("one process", () => {
    expect(importXml(oneProcessXml)).toStrictEqual(oneProcessData);
  });
  it("two process", () => {
    expect(importXml(twoProcessXml)).toStrictEqual(twoProcessData);
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
  application1.xpdlId = "app1";
  application1.name = "name1";
  application1.extendedName = "extName1";
  application1.extendedValue = "extValue1";
  process.detail.applications.push(dataFactory.createApplication(process.detail.applications));
  const application2 = process.detail.applications[1];
  application2.xpdlId = "app2";
  application2.name = "name2";
  application2.extendedName = "extName2";
  application2.extendedValue = "extValue2";
  process.detail.environments.push(dataFactory.createEnvironment(process.detail.environments));
  process.detail.environments.push(dataFactory.createEnvironment(process.detail.environments));
  process.actors.push(dataFactory.createActorEntity(process.actors));
  const actor1 = process.actors[0];
  const actor2 = process.actors[1];

  process.nodeList.push(
    dataFactory.createActivityNode(process.nodeList, actor1.id, "manualActivity", 11, 12),
  );
  const manualActivity = process.nodeList[0] as ActivityNode;
  process.nodeList.push(
    dataFactory.createActivityNode(process.nodeList, actor2.id, "autoActivity", 21, 22),
  );
  const autoActivity = process.nodeList[1] as ActivityNode;
  autoActivity.applications = [
    { id: application1.id, ognl: "ognl1" },
    { id: application2.id, ognl: "ognl2" },
  ];
  process.nodeList.push(
    dataFactory.createActivityNode(process.nodeList, actor1.id, "manualTimerActivity", 31, 32),
  );
  const manualTimerActivity = process.nodeList[2] as ActivityNode;
  process.nodeList.push(
    dataFactory.createActivityNode(process.nodeList, actor2.id, "autoTimerActivity", 41, 42),
  );
  const autoTimerActivity = process.nodeList[3] as ActivityNode;
  process.nodeList.push(
    dataFactory.createActivityNode(process.nodeList, actor1.id, "userActivity", 51, 52),
  );
  const userActivity = process.nodeList[4] as ActivityNode;

  process.nodeList.push(dataFactory.createStartNode(process.nodeList, 10, 11));
  const startNode = process.nodeList[5];
  process.nodeList.push(dataFactory.createEndNode(process.nodeList, 61, 62));
  const endNode = process.nodeList[6];
  process.nodeList.push(dataFactory.createCommentNode(process.nodeList, 71, 72));
  const commentNode = process.nodeList[7] as CommentNode;

  process.edgeList.push(
    dataFactory.createTransitionEdge(process.edgeList, manualTimerActivity.id, manualActivity.id),
  );
  process.edgeList.push(
    dataFactory.createTransitionEdge(process.edgeList, manualActivity.id, autoActivity.id),
  );
  process.edgeList.push(
    dataFactory.createTransitionEdge(process.edgeList, userActivity.id, autoActivity.id),
  );
  process.edgeList.push(
    dataFactory.createTransitionEdge(process.edgeList, autoActivity.id, manualTimerActivity.id),
  );
  process.edgeList.push(
    dataFactory.createTransitionEdge(process.edgeList, autoActivity.id, autoTimerActivity.id),
  );
  process.edgeList.push(
    dataFactory.createTransitionEdge(
      process.edgeList,
      manualTimerActivity.id,
      autoTimerActivity.id,
    ),
  );
  process.edgeList.push(
    dataFactory.createTransitionEdge(process.edgeList, autoTimerActivity.id, userActivity.id),
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

  process.edgeList.push(
    dataFactory.createStartEdge(process.edgeList, startNode.id, manualActivity.id),
  );
  process.edgeList.push(dataFactory.createEndEdge(process.edgeList, userActivity.id, endNode.id));
  process.edgeList.push(
    dataFactory.createCommentEdge(process.edgeList, commentNode.id, userActivity.id),
  );

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
        <Application Id="app1" Name="name1">
          <ExtendedAttributes>
            <ExtendedAttribute Name="extName1" Value="extValue1"></ExtendedAttribute>
          </ExtendedAttributes>
        </Application>
        <Application Id="app2" Name="name2">
          <ExtendedAttributes>
            <ExtendedAttribute Name="extName2" Value="extValue2"></ExtendedAttribute>
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
            <Tool Id="app1" Type="APPLICATION">
              <ExtendedAttributes>
                <ExtendedAttribute Name="ognl" Value="ognl1"></ExtendedAttribute>
              </ExtendedAttributes>
            </Tool>
            <Tool Id="app2" Type="APPLICATION">
              <ExtendedAttributes>
                <ExtendedAttribute Name="ognl" Value="ognl2"></ExtendedAttribute>
              </ExtendedAttributes>
            </Tool>
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
        <ExtendedAttribute Name="JaWE_GRAPH_START_OF_WORKFLOW" Value="CONNECTING_ACTIVITY_ID=activity-1,X_OFFSET=10,Y_OFFSET=11"></ExtendedAttribute>
        <ExtendedAttribute Name="JaWE_GRAPH_END_OF_WORKFLOW" Value="CONNECTING_ACTIVITY_ID=activity-5,X_OFFSET=61,Y_OFFSET=62"></ExtendedAttribute>
        <ExtendedAttribute Name="BURI_GRAPH_COMMENT" Value="CONNECTING_ACTIVITY_ID=activity-5,X_OFFSET=71,Y_OFFSET=72,COMMENT=コメント"></ExtendedAttribute>
        <ExtendedAttribute Name="JaWE_GRAPH_WORKFLOW_PARTICIPANT_ORDER" Value="actor-1;actor-2"></ExtendedAttribute>
        <ExtendedAttribute Name="name1" Value="value1"></ExtendedAttribute>
        <ExtendedAttribute Name="name2" Value="value2"></ExtendedAttribute>
      </ExtendedAttributes>
    </WorkflowProcess>
  </WorkflowProcesses>
  <ExtendedAttributes>
    <ExtendedAttribute Name="EDITING_TOOL" Value="EscafeFlow Editor"></ExtendedAttribute>
    <ExtendedAttribute Name="EDITING_TOOL_VERSION" Value="0.2.0"></ExtendedAttribute>
  </ExtendedAttributes>
</Package>
`;

const twoProcessData = dataFactory.createProject("0001-01-01T00:00:00.000Z");
twoProcessData.processes.push(
  dataFactory.createProcess(twoProcessData.processes, "9999-01-01T00:00:00.000Z"),
);
const twoProcessXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
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
    <WorkflowProcess Id="process-2" Name="プロセス2">
      <ProcessHeader>
        <Created>9999-01-01T00:00:00.000Z</Created>
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
