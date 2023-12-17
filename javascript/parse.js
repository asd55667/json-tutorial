const { PARSE_RESULT } = require('./enum')


function parse_primitive(str, primitive, value) {
    if (str == primitive) return value
    else if (str.startsWith(primitive)) return PARSE_RESULT.ROOT_NOT_SINGULAR
    else return PARSE_RESULT.INVALID_VALUE
}

module.exports = function parse(str) {
    if (!str.trim()) return PARSE_RESULT.EXPECT_VALUE

    const ch = str[0]
    switch (ch) {
        case 'n':
            return parse_primitive(str, 'null', null)
        case 't':
            return parse_primitive(str, 'true', true)
        case 'f':
            return parse_primitive(str, 'false', false)
        default:
            return PARSE_RESULT.INVALID_VALUE
    }
}