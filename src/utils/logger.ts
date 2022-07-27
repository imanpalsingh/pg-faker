import chalk from 'chalk';
import {VerbosityLevel} from '../../types/domain.js';

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

  startParse(config: string) {
    this.#log(chalk.blue(`Parsing: ${config}`), VerbosityLevel.info);
  }

  fetchDump() {
    this.#log(chalk.blue(`Spinning up a pg_dump fork`), VerbosityLevel.info);
  }

  startDump(source: string) {
    this.#log(chalk.blue(`Dumping to: ${source}`), VerbosityLevel.info);
  }

  complete() {
    this.#log(chalk.blue(`\nDump Complete`), VerbosityLevel.info);
  }

  currentTable(tableName: string) {
    this.#log(`\nMasking table: ${chalk.yellow(tableName)}`, VerbosityLevel.info);
  }

  skipTableFromOutput(table: string) {
    this.#log(`\nSkipped a query for: ${chalk.yellow(table)}`, VerbosityLevel.info);
  }

  skipTableFromMasking(table: string) {
    this.#log(`Skipping masking rules for: ${chalk.yellow(table)}`, VerbosityLevel.info);
  }

  skippedColumns(columns: string[]) {
    this.#log(`Skipping Columns: ${chalk.red(columns)}`, VerbosityLevel.verbose);
  }

  transformedColumns(columns: string[]) {
    this.#log(`Transforming columns: ${chalk.green(columns)}`, VerbosityLevel.verbose);
  }

  nothingTransformed() {
    this.#log(`No columns set to transform`, VerbosityLevel.verbose);
  }

  static error(value: string) {
    console.error(chalk.red(`${value}`));
  }

  static warn(value: string) {
    console.error(chalk.yellow(`Warning: ${value}`));
  }
}

export {Logger};
