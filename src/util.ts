const isNumber = (str: string): boolean => !Number.isNaN(Number(str));

const color = {
  red: (str: string): string => `\x1b[31m${str}\x1b[0m\n`,
  green: (str: string): string => `\x1b[32m${str}\x1b[0m\n`,
};

const ctg = (x: number) => 1 / Math.tan(x);

const lengthAfterFixedPoint = (num: number):number => {
  const integer = Math.floor(num);
  const str = String(num - integer).slice(2);
  return str.length;
};

export {
  lengthAfterFixedPoint,
  isNumber,
  color,
  ctg,
};
