const table = require("console-table-printer");
const readline = require("readline");
const util = require("util");

const color = {
  red: (str) => `\x1b[31m${str}\x1b[0m\n`,
  green: (str) => `\x1b[32m${str}\x1b[0m\n`,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.question[util.promisify.custom] = (arg) =>
  new Promise((resolve) => {
    rl.question(arg, resolve);
  });

const rdQuestion = util.promisify(rl.question);

const question = async () => {
  try {
    const valueA = await rdQuestion("Введите начальное значение\n---> ");
    if (!Number.isNumber(valueA)) {
      throw Error("Введите число");
    }

    rl.output.write(color.green(`A = ${valueA}`));

    const valueB = await rdQuestion("Введите конечное значение\n---> ");
    if (!Number.isNumber(valueB)) {
      throw Error("Введите число");
    }
    rl.output.write(color.green(`B = ${valueB}`));

    const valueDeltaX = await rdQuestion(
      "Введите шаг изменения переменной\n---> "
    );
    if (!Number.isNumber(valueDeltaX)) {
      throw Error("Введите число");
    }

    // if (+valueA === +valueB) {
    //   throw Error('Начальное и конечные значения Х не должны совпадать');
    // }

    if (+valueA > +valueB && Math.sign(valueDeltaX) > 0) {
      throw Error("При нач. > кон. шаг не может быть положительным");
    }

    if (+valueDeltaX <= 0) {
      throw Error("Шаг не может быть меньше или равен нулю");
    }

    rl.output.write(color.green(`deltaX = ${valueDeltaX}`));

    const calculationRange = {
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
