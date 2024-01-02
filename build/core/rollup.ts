/*
 * @Date: 2023-12-29 21:29:17
 * @Description: Modify here please
 */
import { getPackageDependencies } from "../utils";
import { libraryPackage, PKG_PREFIX, UINAME } from ".";

import type { OutputOptions, RollupBuild } from "rollup";

export const getPackageSpacesMap = () => {
  // 工程packages目录下的文件
  const directorys = ["components", "core", "hooks"];

  const packageSpacesEnum: Record<string, string> = {};

  directorys.forEach((item) => {
    packageSpacesEnum[`${PKG_PREFIX}/${item}`] = `${UINAME}/es/${item}`;
  });

  return packageSpacesEnum;
};

/** 生成打包 包外部 */
export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(libraryPackage);

  return (id: string) => {
    const packages: string[] = [...peerDependencies];
    if (!options.full) {
      packages.push("@vue", ...dependencies);
    }
    return [...new Set(packages)].some((pkg) => id === pkg || id.startsWith(`${pkg}/`));
  };
};

// 构建捆绑
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)));
}

// 构建声明文件时：转换生成文件的路径
export const writeTsTypesPath = (filePath: string): string => {
  const typesPath = `/types/${UINAME}/`;
  if (filePath.indexOf(typesPath) != -1) {
    const paths = filePath.split(typesPath);
    return `${paths[0]}/types/${paths[1]}`;
  } else {
    return filePath;
  }
};

// 构建声明文件时：转换内容里面的路径
export const writeTsTypesContent = (content: string): string => {
  const spacesMap = getPackageSpacesMap();
  let code = "";
  Object.keys(spacesMap).forEach((key) => {
    if (!code) code = content;
    {
      const regex = new RegExp(key, "g");
      code = code.replace(regex, spacesMap[key]);
    }
  });
  return code;
};
