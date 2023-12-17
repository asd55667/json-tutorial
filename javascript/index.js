const { PARSE_RESULT } = require('./enum')

module.exports.PARSE_RESULT = PARSE_RESULT


const parse = require('./parse')

module.exports.parse = function (str) {
    return parse(str)
    // TODO: implement this function to pass the tests
    return JSON.parse(str)
}

module.exports.stringify = function (value) {
    // TODO: implement this function to pass the tests
    return JSON.stringify(value)
}