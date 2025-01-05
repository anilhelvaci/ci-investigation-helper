export default {
    prList: {
        search: [
            '-S',
            'created:>2024-04-18 state:closed state:open'
        ],
        limit: ['--limit', '100'],
        out: './pr_list.txt'
    },
    filter: {
        middle: 'only_target.txt',
        out: 'filter.txt',
        key: 'a3p-integration'
    }
}