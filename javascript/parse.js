const { PARSE_RESULT } = require('./enum')


function parse_primitive(str, primitive, value) {
    if (str == primitive) return value
    else if (str.startsWith(primitive)) return PARSE_RESULT.ROOT_NOT_SINGULAR
    else return PARSE_RESULT.INVALID_VALUE
}

function parse_number(str) {
    const negative = str[0] === '-'
    if (str[0] === '0' && isDigit(str[1])) return PARSE_RESULT.ROOT_NOT_SINGULAR

    const [result, i] = parse_decimal(str, negative ? 1 : 0)
    if (i === -1) return PARSE_RESULT.INVALID_VALUE

    if (str[i] === 'e' || str[i] === 'E') {
        const sign = str[i + 1] === '-' ? -1 : 1
        const idx = isDigit(str[i + 1]) ? i + 1 : i + 2
        let [exponent, _] = parse_decimal(str, idx)
        exponent = sign * exponent

        const res = (exponent === -324) ? Number.MIN_VALUE : result * Math.pow(10, exponent)
        if (res === Infinity) return PARSE_RESULT.NUMBER_TOO_BIG
        return negative && res !== 0 ? -1 * res : res
    }
    if (str.length > i) return PARSE_RESULT.ROOT_NOT_SINGULAR

    return negative && result !== 0 ? -1 * result : result
}

function parse_decimal(str, idx) {
    const [integer, i] = parse_int(str, idx)
    if (str[i] === '.') {
        if (!isDigit(str[i + 1])) return [0, -1]
        const [frac, j] = parse_int(str, i + 1)
        const result = integer + frac / 10 ** (j - i - 1)
        return [result, j]
    }
    return [integer, i]
}

function parse_int(str, idx) {
    let i = idx
    while (isDigit(str[i])) i++

    if (i === idx) return [0, i]

    let s = 0
    for (let j = i; j > idx; j--) {
        s += 10 ** (i - j) * getDigit(str[j - 1])
    }
    return [s, i]
}

function isDigit(ch) {
    return ch && ch.charCodeAt() >= '0'.charCodeAt() && ch.charCodeAt() <= '9'.charCodeAt()
}

function getDigit(ch) {
    return ch.charCodeAt() - '0'.charCodeAt()
}

function parse_string(str) {
    if (str.length === 1 || str[str.length - 1] !== "\"") return PARSE_RESULT.MISS_QUOTATION_MARK
    let string = ""
    let i = 1
    while (i < str.length && str[i] !== "\"") {
        if (str[i] === "\\") {
            switch (str[i + 1]) {
                case 'n': string += "\n"; break;
                case '\\': string += "\\"; break;
                case '\/': string += "\/"; break;
                case '\"': string += "\""; break;
                case 'b': string += "\b"; break;
                case 'f': string += "\f"; break;
                case 't': string += "\t"; break;
                case 'r': string += "\r"; break;
                default: return PARSE_RESULT.INVALID_STRING_ESCAPE;
            }
            i += 2
        } else if (str[i].charCodeAt() < 0x20) {
            return PARSE_RESULT.INVALID_STRING_CHAR
        } else {
            string += str[i++]
        }
    }
    return string
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
        case '-': return parse_number(str)
        case "\"": return parse_string(str)
        default:
            if (ch.charCodeAt() >= '0'.charCodeAt() && ch.charCodeAt() <= '9'.charCodeAt())
                return parse_number(str)
            return PARSE_RESULT.INVALID_VALUE
    }
}