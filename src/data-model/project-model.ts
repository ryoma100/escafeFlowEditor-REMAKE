import { createSignal } from "solid-js";
import { dataFactory } from "../data-source/data-factory";
import { ProjectEntity } from "../data-source/data-type";
import { makeProcessModel } from "./process-model";

export function makeProjectModel(processModel: ReturnType<typeof makeProcessModel>) {
  function initProject() {
    const newProject = dataFactory.createProject();
    setProject(newProject);
    processModel.load(newProject);
  }

  const [project, setProject] = createSignal<ProjectEntity>(undefined as never);
  initProject();

  function save() {
    processModel.save();
  }

  return { project, setProject, initProject, save };
}
