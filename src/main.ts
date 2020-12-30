import { Table } from 'console-table-printer';
import { rl, questionPromise } from './readlineSettings';
import {
  isNumber, color, ctg, lengthAfterFixedPoint,
} from './util';

const num = 42;

interface InputsParameters {
  a: number,
  b: number,
  deltaX: number,
}

interface Calculation {
  n: number,
  Xn: number,
  F: number | string
}

const calculationEvenNumber = (currentX: number): number => Math.max(
  Math.log((1 - num) / Math.sin(currentX + num)),
  Math.abs(ctg(currentX) / num),
);

const calculationOddNumber = (currentX: number): number => Math.min(
  Math.log((1 - num) / Math.cos(currentX - num)),
  Math.tan(currentX) / num,
);

const calculationNumber = (X: number): number => (
  Math.abs(X % 2) === 0
    ? calculationEvenNumber(X)
    : calculationOddNumber(X));

const calculation = (parameters: InputsParameters): Calculation[] => {
  const fixedLength = lengthAfterFixedPoint(parameters.deltaX);
  const data: Calculation[] = [];
  let index = 1;

  for (let i = parameters.a; i !== parameters.b + parameters.deltaX;
    i = Number((parameters.deltaX + i).toFixed(fixedLength))) {
    const calcF = calculationNumber(i);
    const F = Number.isNaN(calcF) || calcF === Infinity ? 'ошибка' : calcF;
    data.push({
      n: index,
      Xn: i,
      F,
    });
    index += 1;
  }

  return data;
};

const question = async (): Promise<InputsParameters> => {
  try {
    const valueA = await questionPromise('Введите начальное значение\n---> ');
    if (!isNumber(valueA)) {
      throw Error('Введите число');
    }
    rl.output.write(color.green(`A = ${valueA}`));

    const valueB = await questionPromise('Введите конечное значение\n---> ');
    if (!isNumber(valueB)) {
      throw Error('Введите число');
    }
    rl.output.write(color.green(`B = ${valueB}`));

    const valueDeltaX = await questionPromise('Введите шаг изменения переменной\n---> ');
    if (!isNumber(valueDeltaX)) {
      throw Error('Введите число');
    }

    if (+valueDeltaX === 0) {
      throw Error('Шаг не может быть равен нулю');
    }

    rl.output.write(color.green(`deltaX = ${valueDeltaX}`));

    const calculationRange: InputsParameters = {
      a: Number(valueA),
      b: Number(valueB),
      deltaX: Number(valueDeltaX),
    };

    return calculationRange;
  } catch (err) {
    rl.output.write(color.red(err.message));
    return question();
  }
};

const calculationTable = async (): Promise<void> => {
  const parameters = await question();
  const calculationData = calculation(parameters);
  const table = new Table({
    columns: [
      { name: 'n', alignment: 'left', color: 'blue' },
      { name: 'Xn', alignment: 'right' },
      { name: 'F', alignment: 'right' },
    ],
    sort: (row1: Calculation, row2: Calculation) => row1.n - row2.n,
  });
  table.addRows(calculationData);
  table.printTable();
};

calculationTable();
