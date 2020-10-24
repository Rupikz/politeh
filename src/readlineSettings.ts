const readline = require('readline');
const util = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.question[util.promisify.custom] = (arg: string) => new Promise((resolve) => {
  rl.question(arg, resolve);
});

const questionPromise = util.promisify(rl.question);

export {
  rl,
  questionPromise,
};
