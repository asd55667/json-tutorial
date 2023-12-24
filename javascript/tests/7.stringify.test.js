const test = require('ava')
const { stringify, parse } = require('..')

function TEST_ROUNDTRIP(t, json) {
    t.deepEqual(stringify(parse(json)), json)
}

test('stringify basic', t => {
    TEST_ROUNDTRIP(t, "null");
    TEST_ROUNDTRIP(t, "false");
    TEST_ROUNDTRIP(t, "true");
})

test('stringify number', t => {
    TEST_ROUNDTRIP(t, '0')
    TEST_ROUNDTRIP(t, '-0')
    TEST_ROUNDTRIP(t, '1')
    TEST_ROUNDTRIP(t, '-1')
    TEST_ROUNDTRIP(t, '1.5')
    TEST_ROUNDTRIP(t, '-1.5')
    TEST_ROUNDTRIP(t, '3.25')
    TEST_ROUNDTRIP(t, '1e+20')
    TEST_ROUNDTRIP(t, '1.234e+20')
    TEST_ROUNDTRIP(t, '1.234e-20')

    TEST_ROUNDTRIP(t, '1.0000000000000002') /* the smallest number > 1 */
    TEST_ROUNDTRIP(t, '4.9406564584124654e-324') /* minimum denormal */
    TEST_ROUNDTRIP(t, '-4.9406564584124654e-324')
    TEST_ROUNDTRIP(t, '2.2250738585072009e-308') /* Max subnormal double */
    TEST_ROUNDTRIP(t, '-2.2250738585072009e-308')
    TEST_ROUNDTRIP(t, '2.2250738585072014e-308') /* Min normal positive double */
    TEST_ROUNDTRIP(t, '-2.2250738585072014e-308')
    TEST_ROUNDTRIP(t, '1.7976931348623157e+308') /* Max double */
    TEST_ROUNDTRIP(t, '-1.7976931348623157e+308')
})

test('stringify string', t => {
    TEST_ROUNDTRIP(t, "\"\"");
    TEST_ROUNDTRIP(t, "\"Hello\"");
    TEST_ROUNDTRIP(t, "\"Hello\\nWorld\"");
    TEST_ROUNDTRIP(t, "\"\\\" \\\\ / \\b \\f \\n \\r \\t\"");
    TEST_ROUNDTRIP(t, "\"Hello\\u0000World\"");
})

test('stringify array', t => {
    TEST_ROUNDTRIP(t, "[]");
    TEST_ROUNDTRIP(t, "[null,false,true,123,\"abc\",[1,2,3]]");
})

test('stringify object', t => {
    TEST_ROUNDTRIP(t, "{}");
    TEST_ROUNDTRIP(t, "{\"n\":null,\"f\":false,\"t\":true,\"i\":123,\"s\":\"abc\",\"a\":[1,2,3],\"o\":{\"1\":1,\"2\":2,\"3\":3}}");
})