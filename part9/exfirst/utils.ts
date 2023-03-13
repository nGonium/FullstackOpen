export const getArgs = () => process.argv.slice(2);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapArrayToNumbers = (array: any[]) =>
  array.map((el) => Number(el));
export const isArrayContainsNaN = (array: number[]) =>
  array.findIndex((el) => isNaN(el)) > -1;
