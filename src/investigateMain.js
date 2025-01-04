/* eslint-env node */
import investigationConfig from '../config.js';

/**
 *
 * @param {string} progName
 * @param {string[]} args
 * @param {object} io
 * @param {typeof import('fs/promises')} io.fs
 * @param {typeof import('node:child_process').execFileSync} io.execFileSync
 */

export const main = async (progName, args, io) => {
  const { prList: { out, search, limit } } = investigationConfig;

  const {
    fs: { open },
    execFileSync,
  } = io;
  const prs = await open(out, 'w+');
  const ws = prs.createWriteStream();
  const stdout = execFileSync(
    'gh',
    [
      'pr',
      'list',
      '-R',
      'Agoric/agoric-sdk',
      ...search,
      ...limit,
      '--json',
      'url,files,title,number',
    ],
    { stdio: ['pipe', ws, 'pipe'], encoding: 'utf-8' },
  );
  console.log(stdout);
  // const testProcess = spawnSync('gh', ['pr', 'list', '-R', 'Agoric/agoric-sdk', '-S', 'created:>2024-04-18 state:closed state:open', '-L100', '--json', 'url,files,title,number'], { stdio: ['pipe', ws, 'pipe'] })
  // testProcess.stdout.pipe(ws);
  // testProcess.stderr.pipe(ws);
};
