import { createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { ProjectEntity } from "../data-source/data-type";
import { makeProcessModel } from "./process-model";

export function makeProjectModel(processModel: ReturnType<typeof makeProcessModel>) {
  const defaultProject: ProjectEntity = dataFactory.createProject();
  processModel.load(defaultProject);

  const [project, setProject] = createSignal<ProjectEntity>(defaultProject);

  function newProject() {
    const project = dataFactory.createProject();
    setProject(project);
    processModel.load(project);
  }

  return { project, setProject, newProject };
}
