import yargs from 'yargs';

const argv = yargs.usage('usage: $0 <command>').commandDir('commands').help('help').wrap(null).argv;
