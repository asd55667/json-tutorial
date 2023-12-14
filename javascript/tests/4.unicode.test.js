const test = require('ava')
const { parse, PARSE_RESULT } = require('..')

test('parse string', t => {
    t.deepEqual(parse("\"Hello\\u0000World\""), "Hello\0World")
    t.deepEqual(parse("\"\\u0024\""), "\x24")          /* Dollar sign U+0024 */
    t.deepEqual(parse("\"\\u00A2\""), "\xC2\xA2")      /* Cents sign U+00A2 */
    t.deepEqual(parse("\"\\u20AC\""), "\xE2\x82\xAC")  /* Euro sign U+20AC */
    t.deepEqual(parse("\"\\uD834\\uDD1E\""), "\xF0\x9D\x84\x9E") /* G clef sign U+1D11E */
    t.deepEqual(parse("\"\\ud834\\udd1e\""), "\xF0\x9D\x84\x9E") /* G clef sign U+1D11E */
})

test('parse invalid unicode hex', t => {
    t.deepEqual(parse("\"\\u\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u0\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u01\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u012\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u/000\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\uG000\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u0/00\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u0G00\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u0/00\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u00G0\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u000/\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u000G\""), PARSE_RESULT.INVALID_UNICODE_HEX)
    t.deepEqual(parse("\"\\u 123\""), PARSE_RESULT.INVALID_UNICODE_HEX)
})

test('parse invalid unicode surrogate', t => {
    t.deepEqual(parse("\"\\uD800\""), PARSE_RESULT.INVALID_UNICODE_SURROGATE)
    t.deepEqual(parse("\"\\uDBFF\""), PARSE_RESULT.INVALID_UNICODE_SURROGATE)
    t.deepEqual(parse("\"\\uD800\\\\\""), PARSE_RESULT.INVALID_UNICODE_SURROGATE)
    t.deepEqual(parse("\"\\uD800\\uDBFF\""), PARSE_RESULT.INVALID_UNICODE_SURROGATE)
    t.deepEqual(parse("\"\\uD800\\uE000\""), PARSE_RESULT.INVALID_UNICODE_SURROGATE)
})