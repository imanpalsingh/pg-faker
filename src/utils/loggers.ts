import chalk from 'chalk';

export function info(message: string) {
  console.error(chalk.blue(message));
}

export function error(message: string) {
  console.error((chalk.bgRed(message)));
}

export function success(message: string) {
  console.error((chalk.bgGreen(message)));
}
