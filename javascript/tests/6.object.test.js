const test = require('ava')
const { parse, PARSE_RESULT } = require('..')

test('parse object', t => {
    t.deepEqual(parse('{}'), {})
    t.deepEqual(parse(`
{ 
    \"n\" : null , 
    \"f\" : false , 
    \"t\" : true , 
    \"i\" : 123 , 
    \"s\" : \"abc\", 
    \"a\" : [ 1, 2, 3 ],
    \"o\" : { \"1\" : 1, \"2\" : 2, \"3\" : 3 }
}
    `), {
        n: null,
        f: false,
        t: true,
        i: 123,
        s: "abc",
        a: [1, 2, 3],
        o: {
            1: 1,
            2: 2,
            3: 3
        }
    })
    t.deepEqual(parse('{"a":{"b":{"c":1}}}'), {
        a: {
            b: {
                c: 1
            }
        }
    })
})

test('parse miss key', t => {
    t.deepEqual(parse('{:1,'), PARSE_RESULT.MISS_KEY)
    t.deepEqual(parse('{1:1,'), PARSE_RESULT.MISS_KEY)
    t.deepEqual(parse('{true:1,'), PARSE_RESULT.MISS_KEY)
    t.deepEqual(parse('{false:1,'), PARSE_RESULT.MISS_KEY)
    t.deepEqual(parse('{null:1,'), PARSE_RESULT.MISS_KEY)
    t.deepEqual(parse('{[]:1,'), PARSE_RESULT.MISS_KEY)
    t.deepEqual(parse('{{}:1,'), PARSE_RESULT.MISS_KEY)
    t.deepEqual(parse('{\"a\":1,'), PARSE_RESULT.MISS_KEY)
})

test('parse miss colon', t => {
    t.deepEqual(parse('{\"a\"'), PARSE_RESULT.MISS_COLON)
    t.deepEqual(parse("{\"a\",\"b\"}"), PARSE_RESULT.MISS_COLON)
})

test('parse miss comma or curly bracket', t => {
    t.deepEqual(parse('{\"a\":1'), PARSE_RESULT.MISS_COMMA_OR_CURLY_BRACKET)
    t.deepEqual(parse('{\"a\":1]'), PARSE_RESULT.MISS_COMMA_OR_CURLY_BRACKET)
    t.deepEqual(parse('{\"a\":1 \"b\"'), PARSE_RESULT.MISS_COMMA_OR_CURLY_BRACKET)
    t.deepEqual(parse('{\"a\":{}'), PARSE_RESULT.MISS_COMMA_OR_CURLY_BRACKET)
})