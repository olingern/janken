import * as init from '../lib/init';

export const command = 'init';

export const describe = 'bee boop';

export const builder = {};

const readline = require('readline');

function red(msg: string) {
  return `\u001B[31m${msg}\u001B[39m`
}

function cyan(msg: string) {
  return `\u001b[36m${msg}\u001B[39m`
}

function green(msg: string) {
  return `\u001b[32m${msg}\u001B[39m`
}

function askQuestion(readLine: any, question: string): Promise<string> {
  return new Promise((res, rej) => {
    readLine.question(`${red("•")} ${cyan(question)}: `, function (name) {
      res(name);
    });
  });
}

export const handler = async function (argv: any) {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const connectionName = await askQuestion(rl, "Name of this connection");
  const connectionString = await askQuestion(rl, 'Database connection string');

  if (init.configExistsSync()) {
    const ans = await askQuestion(rl, 'File already exists. Overwrite? (y/n)');
    if (ans === 'n') {
      process.stdout.write('- Okay, exiting.\n');
      process.exit(0);
    }
  }

  const result = init.writeConfigSync([{ connectionName, connectionString }]);

  if (result) {
    process.stdout.write(green('✔️ Config written\n\n'));
  }

  rl.close();
  process.exit(0);
};
