import { createSignal } from "solid-js";
import { ProjectEntity } from "../data-source/data-type";
import { dataSource } from "../data-source/data-source";

export function createProjectModel() {
  const [project, setProject] = createSignal<ProjectEntity>(dataSource.project);

  return { project, setProject };
}
