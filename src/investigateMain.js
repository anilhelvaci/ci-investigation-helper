/* eslint-env node */
import investigationConfig from '../config.js';
import { makeInvestigator } from './cli-helpers.js';

const makeLogger = progName => (...args) => console.log(progName, args);

/**
 *
 * @param {string} progName
 * @param {string[]} args
 * @param {object} io
 * @param {typeof import('fs/promises')} io.fsp
 * @param {typeof import('child_process').execFileSync} io.execFileSync
 */

export const main = async (progName, args, io) => {
  const log = makeLogger(progName);
  log('Running with args', ...args);

  const investigator = makeInvestigator({ ...io, log }, investigationConfig);
  await investigator.fetchPrList();

  await investigator.filterPrs();
};
