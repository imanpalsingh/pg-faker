#!/usr/bin/env node
import { command } from './cli/lex.js';

command.parse(process.argv);
