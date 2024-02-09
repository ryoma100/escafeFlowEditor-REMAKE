import { createSignal } from "solid-js";
import { dataSource } from "../data-source/data-source";
import { ProjectEntity } from "../data-source/data-type";

export function createProjectModel() {
  const [project, setProject] = createSignal<ProjectEntity>(dataSource.project);

  return { project, setProject };
}
