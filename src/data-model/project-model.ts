import { createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { ProjectEntity } from "../data-source/data-type";
import { makeProcessModel } from "./process-model";

export function makeProjectModel(processModel: ReturnType<typeof makeProcessModel>) {
  const _defaultProject: ProjectEntity = dataFactory.createProject();
  processModel.load(_defaultProject);
  const [project, setProject] = createSignal<ProjectEntity>(_defaultProject);

  function clearProject() {
    const newProject = dataFactory.createProject();
    setProject(newProject);
    processModel.load(newProject);
  }

  return { project, setProject, clearProject };
}
