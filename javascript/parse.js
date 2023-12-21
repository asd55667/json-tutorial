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
                case 'u':
                    const [decoded, j] = parse_unicode(str, i)
                    if (j === -1) return PARSE_RESULT.INVALID_UNICODE_HEX
                    if (j === -2) return PARSE_RESULT.INVALID_UNICODE_SURROGATE
                    string += decoded
                    i = j - 2
                    break;
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

function isHex(ch) {
    return isDigit(ch)
        || (ch.charCodeAt() >= 'a'.charCodeAt() && ch.charCodeAt() <= 'f'.charCodeAt())
        || (ch.charCodeAt() >= 'A'.charCodeAt() && ch.charCodeAt() <= 'F'.charCodeAt())
}

function parse_unicode(str, idx) {
    let unicode = ""
    let j = idx;
    while (str[j] === '\\' && str[j + 1] === 'u') {
        unicode += str.slice(j + 2, j + 6)
        j += 6
    }

    const nonHex = unicode.split('').filter(ch => !isHex(ch)).length
    if (unicode.length % 4 || nonHex) return ['', -1]

    const H = unicode.slice(0, 4).split('').reduce((s, ch, i) => s + getCharValue(ch) * 16 ** (4 - i - 1), 0)
    const L = unicode.slice(4).split('').reduce((s, ch, i) => s + getCharValue(ch) * 16 ** (4 - i - 1), 0)

    if (H >= 0xD800 && H <= 0xDBFF && (!L || L < 0xDC00 || L > 0xDFFF)) return ['', -2]

    let val = H + L

    const m = 0x80
    if (val >= 0x000 && val <= 0x007f) {
        return [String.fromCodePoint(val), j]
    } else if (val >= 0x0080 && val <= 0x7ff) {
        const b1 = 0xc0 | val >> 6 & 0x1f
        const b2 = m | val & 0x3f
        return [[b1, b2].map(v => String.fromCodePoint(v)).join(''), j]
    } else if (val >= 0x0800 && val <= 0xffff) {
        const b1 = 0xe0 | val >> 12 & 0xf;
        const b2 = m | val >> 6 & 0x3f;
        const b3 = m | val & 0x3f;
        return [[b1, b2, b3].map(v => String.fromCodePoint(v)).join(''), j]
    } else if (val >= 0x10000 && val <= 0x10ffff) {
        val = 0x10000 + (H - 0xD800) * 0x400 + (L - 0xDC00)
        const b1 = 0xf0 | val >> 18 & 0x7
        const b2 = m | val >> 12 & 0x3f
        const b3 = m | val >> 6 & 0x3f
        const b4 = m | val & 0x3f
        return [[b1, b2, b3, b4].map(v => String.fromCodePoint(v)).join(''), j]
    }
}

function getCharValue(ch) {
    if (isDigit(ch)) return getDigit(ch)
    if (ch.charCodeAt() >= 'a'.charCodeAt()) return ch.charCodeAt() - 'a'.charCodeAt() + 10
    else return ch.charCodeAt() - 'A'.charCodeAt() + 10
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