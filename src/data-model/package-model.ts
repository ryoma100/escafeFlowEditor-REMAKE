import { createSignal } from "solid-js";

export type PackageEntity = {
  pkgId: string;
  title: string;
};

export function createPackageModel() {
  const [pkg, setPkg] = createSignal<PackageEntity>({
    pkgId: "newpkg",
    title: "パッケージ",
  });

  return { pkg, setPkg };
}
