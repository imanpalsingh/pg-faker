import { Command } from 'commander';
import { cli } from './cli.js';

const command = new Command();

command.argument('<config>').description('Path to the js configuration file').option('-o --output <outFile>', 'Name of the output sql file', 'dump.sql').action(cli);

export { command };
