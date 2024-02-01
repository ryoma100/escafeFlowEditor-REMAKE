import { dataFactory } from "./data-factory";
import { ProcessEntity } from "./data-type";

let pkg = dataFactory.createPackage();

function clearPackage() {
  pkg = dataFactory.createPackage();
}

function findProcess(processId: number): ProcessEntity {
  const process = pkg.processes.find((it) => it.id === processId);
  if (!process) {
    throw new Error(`DataSource: process not found. id=${processId}`);
  }
  return process;
}

export const dataSource = {
  pkg,
  clearPackage,
  findProcess,
};
