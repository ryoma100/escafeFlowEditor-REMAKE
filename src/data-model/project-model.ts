import { dataFactory } from "../data-source/data-factory";
import { ProjectDetailEntity, ProjectEntity } from "../data-source/data-type";
import { makeProcessModel } from "./process-model";

export function makeProjectModel(processModel: ReturnType<typeof makeProcessModel>) {
  let project: ProjectEntity = dataFactory.createProject();
  initProject();

  function initProject() {
    project = dataFactory.createProject();
    processModel.load(project);
  }

  function setProjectDetail(detail: ProjectDetailEntity) {
    project = { ...project, detail };
  }

  function save() {
    const processes = processModel.save();
    project = { ...project, processes };
  }

  return { initProject, project, setProjectDetail, save };
}
