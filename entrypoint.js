/* eslint-env node */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { main } from './src/investigateMain.js';

main(process.argv[1], process.argv.splice(2), { execFileSync, fs }).catch(
  (err) => console.log(err),
);
