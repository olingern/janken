import chalk from 'chalk';

export class ConsoleLogger {
  constructor() {}

  private _prefix() {
    return '';
  }

  private writeLine(msg: string) {
    process.stdout.write(msg + '\n');
  }

  info(msg: string) {
    this.writeLine(`${chalk.yellow('[INFO] ')} - ${msg}`);
  }

  error(msg: string) {
    this.writeLine(`${chalk.red('[ERROR]')} - ${msg}`);
  }
}
