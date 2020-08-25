import * as yargs from 'yargs';

yargs.usage('usage: $0 <command>').commandDir('commands').help('help').wrap(null).argv;
