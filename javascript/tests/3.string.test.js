const test = require('ava')
const { parse, PARSE_RESULT } = require('..')

test('parse string', t => {
    t.deepEqual(parse("\"\""), "")
    t.deepEqual(parse("\"Hello\""), "Hello")
    t.deepEqual(parse("\"Hello\\nWorld\""), "Hello\nWorld")
    t.deepEqual(parse("\"\\\" \\\\ \\/ \\b \\f \\n \\r \\t\""), "\" \\ / \b \f \n \r \t")
})

test('parse missing quotation mark', t => {
    t.deepEqual(parse("\""), PARSE_RESULT.MISS_QUOTATION_MARK)
    t.deepEqual(parse("\"abc"), PARSE_RESULT.MISS_QUOTATION_MARK)
})

test('parse invalid string escape', t => {
    t.deepEqual(parse("\"\\v\""), PARSE_RESULT.INVALID_STRING_ESCAPE)
    t.deepEqual(parse("\"\\'\""), PARSE_RESULT.INVALID_STRING_ESCAPE)
    t.deepEqual(parse("\"\\0\""), PARSE_RESULT.INVALID_STRING_ESCAPE)
    t.deepEqual(parse("\"\\x12\""), PARSE_RESULT.INVALID_STRING_ESCAPE)
})

test('parse invalid string char', t => {
    t.deepEqual(parse("\"\x01\""), PARSE_RESULT.INVALID_STRING_CHAR)
    t.deepEqual(parse("\"\x1F\""), PARSE_RESULT.INVALID_STRING_CHAR)
})