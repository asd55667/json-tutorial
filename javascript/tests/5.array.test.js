const test = require('ava')
const { parse, PARSE_RESULT } = require('..')

test('parse array', t => {
    t.deepEqual(parse('[]'), [])
    t.deepEqual(parse('[null, false, true, 123, "abc"]'), [null, false, true, 123, "abc"])
    t.deepEqual(parse('[ [ ] , [ 0 ] , [ 0 , 1 ] , [ 0 , 1 , 2 ] ]'), [[], [0], [0, 1], [0, 1, 2]])
})

test('parse invalid array', t => {
    t.deepEqual(parse('[1,]'), PARSE_RESULT.INVALID_VALUE)
    t.deepEqual(parse("[\"a\", nul]"), PARSE_RESULT.INVALID_VALUE)
})

test('parse miss comma or square bracket', t => {
    t.deepEqual(parse('[1'), PARSE_RESULT.MISS_COMMA_OR_SQUARE_BRACKET)
    t.deepEqual(parse('[1}'), PARSE_RESULT.MISS_COMMA_OR_SQUARE_BRACKET)
    t.deepEqual(parse('[1 2'), PARSE_RESULT.MISS_COMMA_OR_SQUARE_BRACKET)
    t.deepEqual(parse('[[]'), PARSE_RESULT.MISS_COMMA_OR_SQUARE_BRACKET)
})