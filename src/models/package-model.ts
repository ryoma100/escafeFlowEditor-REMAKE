import { createSignal } from "solid-js";

function defaultPackage(): PackageEntity {
  return {
    pkgId: "",
    title: "",
  };
}

export type PackageEntity = {
  pkgId: string;
  title: string;
};

export function packageModel() {
  const [pkg, setPkg] = createSignal<PackageEntity>({
    pkgId: "newpkg",
    title: "パッケージ",
  });

  return { pkg, setPkg, defaultPackage };
}
