const test = require('ava')
const { parse, PARSE_RESULT } = require('..')

test('parse number', t => {
    t.deepEqual(0.0, parse("0"));
    t.deepEqual(0.0, parse("-0"));
    t.deepEqual(0.0, parse("-0.0"));
    t.deepEqual(1.0, parse("1"));
    t.deepEqual(-1.0, parse("-1"));
    t.deepEqual(1.5, parse("1.5"));
    t.deepEqual(-1.5, parse("-1.5"));
    t.deepEqual(3.1416, parse("3.1416"));
    t.deepEqual(1E10, parse("1E10"));
    t.deepEqual(1e10, parse("1e10"));
    t.deepEqual(1E+10, parse("1E+10"));
    t.deepEqual(1E-10, parse("1E-10"));
    t.deepEqual(-1E10, parse("-1E10"));
    t.deepEqual(-1e10, parse("-1e10"));
    t.deepEqual(-1E+10, parse("-1E+10"));
    t.deepEqual(-1E-10, parse("-1E-10"));
    t.deepEqual(1.234E+10, parse("1.234E+10"));
    t.deepEqual(1.234E-10, parse("1.234E-10"));
    t.deepEqual(0.0, parse("1e-10000")); /* must underflow */

    t.deepEqual(1.0000000000000002, parse("1.0000000000000002"));/* the smallest number > 1 */
    t.deepEqual(4.9406564584124654e-324, parse("4.9406564584124654e-324"));/* minimum denormal */
    t.deepEqual(-4.9406564584124654e-324, parse("-4.9406564584124654e-324"));
    t.deepEqual(2.2250738585072009e-308, parse("2.2250738585072009e-308"));/* Max subnormal double */
    t.deepEqual(-2.2250738585072009e-308, parse("-2.2250738585072009e-308"));
    t.deepEqual(2.2250738585072014e-308, parse("2.2250738585072014e-308"));/* Min normal positive double */
    t.deepEqual(-2.2250738585072014e-308, parse("-2.2250738585072014e-308"));
    t.deepEqual(1.7976931348623157e+308, parse("1.7976931348623157e+308"));/* Max double */
    t.deepEqual(-1.7976931348623157e+308, parse("-1.7976931348623157e+308"));
})

test('parse invalid number', t => {
    t.deepEqual(parse('+0'), PARSE_RESULT.INVALID_VALUE)
    t.deepEqual(parse('+1'), PARSE_RESULT.INVALID_VALUE)
    t.deepEqual(parse('.123'), PARSE_RESULT.INVALID_VALUE)
    t.deepEqual(parse('1.'), PARSE_RESULT.INVALID_VALUE)
    t.deepEqual(parse('INF'), PARSE_RESULT.INVALID_VALUE)
    t.deepEqual(parse('inf'), PARSE_RESULT.INVALID_VALUE)
    t.deepEqual(parse('NAN'), PARSE_RESULT.INVALID_VALUE)
    t.deepEqual(parse('nan'), PARSE_RESULT.INVALID_VALUE)
})

test('parse root not singular', t => {
    t.deepEqual(parse('0123'), PARSE_RESULT.ROOT_NOT_SINGULAR)
    t.deepEqual(parse('0x0'), PARSE_RESULT.ROOT_NOT_SINGULAR)
    t.deepEqual(parse('0x123'), PARSE_RESULT.ROOT_NOT_SINGULAR)
})

test('parse number too big', t => {
    t.deepEqual(parse('1e309'), PARSE_RESULT.NUMBER_TOO_BIG)
    t.deepEqual(parse('-1e309'), PARSE_RESULT.NUMBER_TOO_BIG)
})