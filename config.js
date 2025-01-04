export default {
    prList: {
        search: [
            '-S',
            'created :>2024-04-18 state:closed state:open'
        ],
        limit: ['--limit', '1000'],
        out: 'pr_list.txt'
    }
}