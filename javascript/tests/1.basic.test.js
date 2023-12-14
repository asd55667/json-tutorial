const test = require('ava')
const { parse, PARSE_RESULT } = require('..')

test('parse value', t => {
    t.deepEqual(parse('null'), JSON.parse('null'))
    t.deepEqual(parse('true'), true)
    t.deepEqual(parse('false'), false)
})

test('parse expect value', t => {
    t.deepEqual(parse(''), PARSE_RESULT.EXPECT_VALUE)
    t.deepEqual(parse(' '), PARSE_RESULT.EXPECT_VALUE)
})

test('parse invalid value', t => {
    t.deepEqual(parse('nul'), PARSE_RESULT.INVALID_VALUE)
    t.deepEqual(parse('?'), PARSE_RESULT.INVALID_VALUE)
})


test('parse root not singular', t => {
    t.deepEqual(parse('null x'), PARSE_RESULT.ROOT_NOT_SINGULAR)
})