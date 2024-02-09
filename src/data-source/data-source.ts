import { dataFactory } from "./data-factory";
import { ProcessEntity } from "./data-type";

let project = dataFactory.createProject();

function clearProject() {
  project = dataFactory.createProject();
}

function findProcess(processId: number): ProcessEntity {
  const process = project.processes.find((it) => it.id === processId);
  if (!process) {
    throw new Error(`DataSource: process not found. id=${processId}`);
  }
  return process;
}

export const dataSource = {
  project,
  clearProject,
  findProcess,
};
