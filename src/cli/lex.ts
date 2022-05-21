import {Command} from 'commander';
import {cli} from './cli.js';

const command = new Command();

// eslint-disable-next-line max-len
command.argument('<config>').description('Path to the js configuration file'). option('-o --output <outFile>', 'Name of the output sql file', 'dump.sql').option('-v --verbose <mode>', 'Verbose mode', 'verbose').action(cli);

export {command};
