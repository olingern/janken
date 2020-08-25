import * as init from '../lib/init';

export const command = 'init';

export const describe = 'Initialize the configuration file';

export const builder = {};

const readline = require('readline');

function red(msg: string) {
  return `\u001B[31m${msg}\u001B[39m`;
}

function cyan(msg: string) {
  return `\u001b[36m${msg}\u001B[39m`;
}

function green(msg: string) {
  return `\u001b[32m${msg}\u001B[39m`;
}

export function formatQuestion(question: string) {
  return `${red('•')} ${cyan(question)}: `;
}

export const questions = {
  configWritten: green('✔️ Config written\n\n'),
  nameOfThisConnection: formatQuestion('Name of this connection'),
  databaseConnectionStr: formatQuestion('Database connection string'),
  fileAlreadyExists: formatQuestion('File already exists. Overwrite? (y/n)'),
  okayExiting: '- Okay, exiting.\n',
};

/**
 * Recursively asks a question until the correct answer is provided. This is
 * currently difficult to test. Writing to stdin or using readline.write doesn't
 * seem to work in a test enviornment. Need to either mock stdin or figure out a
 * way to answer questions
 *
 * @param readLine
 * @param question
 * @param regex
 */
export function askQuestion(readLine: any, question: string, regex: RegExp): Promise<string> {
  return new Promise((res, _rej) => {
    readLine.question(question, function (ans) {
      if (regex.test(ans)) {
        res(ans);
      } else {
        res(askQuestion(readLine, question, regex));
      }
    });
  });
}

/**
 * Exported function invoked by yargs
 * @param _argv
 */
export const handler = async function (_argv: any) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const connectionName = await askQuestion(rl, questions.nameOfThisConnection, /^.{1,}$/);
  const connectionString = await askQuestion(
    rl,
    questions.databaseConnectionStr,
    /[postgres|mysql]+:\/\/.*:.*@\w+\/\w+/,
  );

  if (init.configExistsSync()) {
    const ans = await askQuestion(rl, questions.fileAlreadyExists, /[y|n]/);
    if (ans === 'n') {
      process.stdout.write(questions.okayExiting);
      process.exit(0);
    }
  }

  const result = init.writeConfigSync([{ connectionName, connectionString }]);

  if (result) {
    process.stdout.write(questions.configWritten);
  }

  rl.close();
  process.exit(0);
};
