import { Table } from "console-table-printer";
import { rl, questionPromise } from "./readlineSettings";
import {
  isNumber, color, ctg,
} from "./util";

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
  const data: Calculation[] = [];
  let index = 1;

  for (let i = parameters.a; i <= parameters.b; i += parameters.deltaX) {
    const calcF = calculationNumber(i);

    let F: string | number;
    if (calcF === Infinity) {
      F = "бесконечность";
    } else if (Number.isNaN(calcF)) {
      F = "не число";
    } else {
      F = calcF;
    }

    data.push({
      n: index,
      Xn: i,
      F,
    });

    index += 1;
  }

  index = 1;

  return data;
};

const question = async (): Promise<InputsParameters> => {
  try {
    const valueA = await questionPromise("Введите начальное значение\n---> ");
    if (!isNumber(valueA)) {
      throw Error("Введите число");
    }
    rl.output.write(color.green(`A = ${valueA}`));

    const valueB = await questionPromise("Введите конечное значение\n---> ");
    if (!isNumber(valueB)) {
      throw Error("Введите число");
    }
    rl.output.write(color.green(`B = ${valueB}`));

    const valueDeltaX = await questionPromise("Введите шаг изменения переменной\n---> ");
    if (!isNumber(valueDeltaX)) {
      throw Error("Введите число");
    }

    if (+valueA > +valueB && Math.sign(valueDeltaX) > 0) {
      throw Error("При нач. > кон. шаг не может быть положительным");
    }

    if (+valueDeltaX <= 0) {
      throw Error("Шаг не может быть меньше или равен нулю");
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
      { name: "n", alignment: "left", color: "blue" },
      { name: "Xn", alignment: "right" },
      { name: "F", alignment: "right" },
    ],
    sort: (row1: Calculation, row2: Calculation) => row1.n - row2.n,
  });
  table.addRows(calculationData);
  table.printTable();
  return calculationTable();
};

calculationTable();
