/* eslint-env node */

const repo = ['-R', 'Agoric/agoric-sdk'];
const query = '.[] | . as $parent | .files[] | select(.path | contains($key))| .path | $parent | [.number,.title,.headRefName] | join ("*")'

const toURL = fileName => new URL(fileName, import.meta.url);

/**
 * 
 * @param {{
 *   fsp: typeof import('fs/promises'),
 *   execFileSync: typeof import('child_process').execFileSync
 *   log: typeof console.log   
 * }} io
 * @param {{prList: object, filter: object}} config
 */
export const makeInvestigator = (io, config) => {
    const { fsp: { open, readFile }, execFileSync, log } = io;

    const gh = {
        pr: {
            list: (args, options) => execFileSync('gh', ['pr', 'list', ...repo, ...args, '--json', 'url,files,title,number,headRefName'], options),
        }
    };

    const jq = (key, options) => execFileSync('jq', ['--arg', 'key', key, query], options);
    const awk = options => execFileSync('awk', ['!seen[$0]++'], options);

    const fetchPrList = async () => {
        const { prList: { out, search, limit } } = config;
        const args = [...search, ...limit];
        log(args);
        const prs = await open(toURL(out), 'w+');
        const ws = prs.createWriteStream();

        return gh.pr.list(args, { stdio: ['pipe', ws, 'pipe'], encoding: 'utf-8' });
    };

    const filterPrs = async () => {
        const { prList: { out }, filter: { middle, out: filterOut, key } } = config;
        const queryResultWriteP = open(toURL(middle), 'w+');
        const prListP = open(toURL(out), 'r');
        const filterP = open(toURL(filterOut), 'w+');

        const [queryResultWriteF, filterF, prListF] = await Promise.all([queryResultWriteP, filterP, prListP]);

        const jqOps = { stdio: [prListF.createReadStream(), queryResultWriteF.createWriteStream(), 'pipe'], encoding: 'utf-8' };
        const queryResultReadF = await open(toURL(middle));
        const awkOps = { stdio: [queryResultReadF.createReadStream(), filterF.createWriteStream(), 'pipe'], encoding: 'utf-8' };

        jq(key, jqOps);
        awk(awkOps);
    };

    const readPrList = async path => {
        const content = await readFile(toURL(path), { encoding: 'utf-8' });
        return JSON.parse(content);
    };

    return {
        fetchPrList,
        readPrList,
        filterPrs,
    };
}