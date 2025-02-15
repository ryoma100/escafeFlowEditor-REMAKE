import { createSignal } from "solid-js";

import type { ProcessModel } from "@/data-model/process-model";
import { dataFactory } from "@/data-source/data-factory";
import type { ProjectDetailEntity, ProjectEntity } from "@/data-source/data-type";

const initialProject = dataFactory.createProject();

export function makeProjectModel(processModel: ProcessModel) {
  const [project, setProject] = createSignal(initialProject);
  processModel.load(initialProject);

  function initProject() {
    setProject(dataFactory.createProject());
    processModel.load(project());
  }

  function getProjectDetail(): ProjectDetailEntity {
    return project().detail;
  }

  function setProjectDetail(detail: ProjectDetailEntity) {
    setProject({ ...project(), detail });
  }

  function save(): ProjectEntity {
    const processes = processModel.save();
    setProject({ ...project(), processes });
    return project();
  }

  function load(newProject: ProjectEntity) {
    setProject(newProject);
    processModel.load(project());
  }

  return {
    initProject,
    getProjectDetail,
    setProjectDetail,
    save,
    load,
    project,
  };
}
