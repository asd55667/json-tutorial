const PARSE_RESULT = {
    OK: 0,
    EXPECT_VALUE: 1,
    INVALID_VALUE: 2,
    ROOT_NOT_SINGULAR: 3,
    NUMBER_TOO_BIG: 4,
    MISS_QUOTATION_MARK: 5,
    INVALID_STRING_ESCAPE: 6,
    INVALID_STRING_CHAR: 7,
    INVALID_UNICODE_HEX: 8,
    INVALID_UNICODE_SURROGATE: 9,
    MISS_COMMA_OR_SQUARE_BRACKET: 10,
    MISS_KEY: 11,
    MISS_COLON: 12,
    MISS_COMMA_OR_CURLY_BRACKET: 13,
}
module.exports.PARSE_RESULT = PARSE_RESULT

const PRIMITIVE = {
    NULL: 0,
    FALSE: 1,
    TRUE: 2,
    NUMBER: 3,
    STRING: 4,
    ARRAY: 5,
    OBJECT: 6
}
module.exports.PRIMITIVE = PRIMITIVE

module.exports.parse = function parse(str) {
    // TODO: implement this function to pass the tests
    return JSON.parse(str)
}

module.exports.stringify = function stringify(value) {
    // TODO: implement this function to pass the tests
    return JSON.stringify(value)
}