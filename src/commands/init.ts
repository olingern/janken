import * as init from '../lib/init';

export const command = 'init';

export const describe = 'bee boop';

export const builder = {};

const readline = require('readline');

function askQuestion(readLine: any, question: string): Promise<string> {
  return new Promise((res, rej) => {
    readLine.question(`${question}: `, function (name) {
      res(name);
    });
  });
}

export const handler = async function (argv: any) {
  // do something with argv.

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const connectionName = await askQuestion(rl, 'Name of this connection');
  const connectionString = await askQuestion(rl, 'Database connection string');

  if (init.configExistsSync()) {
    const ans = await askQuestion(rl, 'File already exists. Overwrite? (y/n)');
    if (ans === 'n') {
      process.stdout.write('Okay, exiting.');
      process.exit(0);
    }
  }

  const result = init.writeConfigSync([{ connectionName, connectionString }]);

  if (result) {
    process.stdout.write('Config written');
  }

  rl.close();
  process.exit(0);
};
