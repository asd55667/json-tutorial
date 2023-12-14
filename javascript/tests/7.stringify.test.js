const test = require('ava')
const { stringify } = require('..')

function TEST_ROUNDTRIP(json) {
    test.deepEqual(stringify(parse(json)), json)
}

test('stringify basic', () => {
    TEST_ROUNDTRIP("null");
    TEST_ROUNDTRIP("false");
    TEST_ROUNDTRIP("true");
})

test('stringify number', () => {
    TEST_ROUNDTRIP('0')
    TEST_ROUNDTRIP('-0')
    TEST_ROUNDTRIP('1')
    TEST_ROUNDTRIP('-1')
    TEST_ROUNDTRIP('1.5')
    TEST_ROUNDTRIP('-1.5')
    TEST_ROUNDTRIP('3.25')
    TEST_ROUNDTRIP('1e+20')
    TEST_ROUNDTRIP('1.234e+20')
    TEST_ROUNDTRIP('1.234e-20')

    TEST_ROUNDTRIP('1.0000000000000002') /* the smallest number > 1 */
    TEST_ROUNDTRIP('4.9406564584124654e-324') /* minimum denormal */
    TEST_ROUNDTRIP('-4.9406564584124654e-324')
    TEST_ROUNDTRIP('2.2250738585072009e-308') /* Max subnormal double */
    TEST_ROUNDTRIP('-2.2250738585072009e-308')
    TEST_ROUNDTRIP('2.2250738585072014e-308') /* Min normal positive double */
    TEST_ROUNDTRIP('-2.2250738585072014e-308')
    TEST_ROUNDTRIP('1.7976931348623157e+308') /* Max double */
    TEST_ROUNDTRIP('-1.7976931348623157e+308')
})

test('stringify string', () => {
    TEST_ROUNDTRIP("\"\"");
    TEST_ROUNDTRIP("\"Hello\"");
    TEST_ROUNDTRIP("\"Hello\\nWorld\"");
    TEST_ROUNDTRIP("\"\\\" \\\\ / \\b \\f \\n \\r \\t\"");
    TEST_ROUNDTRIP("\"Hello\\u0000World\"");
})

test('stringify array', () => {
    TEST_ROUNDTRIP("[]");
    TEST_ROUNDTRIP("[null,false,true,123,\"abc\",[1,2,3]]");
})

test('stringify object', () => {
    TEST_ROUNDTRIP("{}");
    TEST_ROUNDTRIP("{\"n\":null,\"f\":false,\"t\":true,\"i\":123,\"s\":\"abc\",\"a\":[1,2,3],\"o\":{\"1\":1,\"2\":2,\"3\":3}}");
})