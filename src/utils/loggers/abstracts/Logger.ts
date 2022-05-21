import chalk from 'chalk';
import {VerbosityLevel} from '../../../../types/domain.js';

class Logger {
  verbosityLevel: VerbosityLevel;
  constructor(verbosityLevel: string) {
    this.verbosityLevel = VerbosityLevel[verbosityLevel as keyof typeof VerbosityLevel];
  }

  #log(output: string, level: VerbosityLevel) {
    if (this.verbosityLevel <= level) {
      console.error(output);
    }
  }

  start(source: string) {
    this.#log(chalk.blue(`Dumping to : ${source}`), VerbosityLevel.info);
  }

  complete() {
    this.#log(chalk.blue(`Dump Complete`), VerbosityLevel.info);
  }

  currentTable(tableName: string) {
    this.#log(`\nMasking table: ${chalk.yellow(tableName)}`, VerbosityLevel.info);
  }

  skipTableFromOutput(table: string) {
    this.#log(`\nSkipped a query for: ${chalk.yellow(table)}`, VerbosityLevel.info);
  }

  skippedColumns(columns: string[]) {
    this.#log(`Skipped Columns: ${chalk.yellow(columns)}`, VerbosityLevel.verbose);
  }

  transformedColumns(columns: string[]) {
    this.#log(`Columns transformed: ${chalk.green(columns)}`, VerbosityLevel.verbose);
  }

  nothingTransformed() {
    this.#log(`No column was transformed`, VerbosityLevel.verbose);
  }

  static error(value: string) {
    console.error((chalk.bgRed(value)));
  }
}

export {Logger};
