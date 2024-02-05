import { createSignal } from "solid-js";
import { PackageEntity } from "../data-source/data-type";
import { dataSource } from "../data-source/data-source";

export function createPackageModel() {
  const [pkg, setPkg] = createSignal<PackageEntity>(dataSource.pkg);

  return { pkg, setPkg };
}
