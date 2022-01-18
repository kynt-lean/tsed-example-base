export function loadPackage(
  packageName: string,
  context: string,
  loaderFn?: Function,
) {
  try {
    return loaderFn ? loaderFn() : require(packageName);
  } catch (e) {
    process.exit(1);
  }
}