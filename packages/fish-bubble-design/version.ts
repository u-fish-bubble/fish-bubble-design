/*
 * @Date: 2023-12-30 14:16:09
 * 每次发布打包前，修改这个地方，保证版本号
 * 这里是控制版本的地方，不要去改动package.json 的 version, 打包时会去替换package.json 的 version
 * 不这么做的原因是：
 * "当你在使用 pnpm 处理多包依赖时，如果本地包的版本与远程版本完全匹配，
 * 则 pnpm 会默认使用本地包覆盖远程包，无论远程包的版本是更新的还是旧的。"
 */
export const version = "1.1.2";
