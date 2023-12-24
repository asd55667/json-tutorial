function stringify_number(n) {
    if (!n) return Object.is(n, 0) ? '0' : '-0'

    let str = n > 0 ? '' : '-'
    n = n > 0 ? n : -n

    if (Number.isInteger(n)) {
        str += utoa(n)
    } else {
        str += dtoa(n)
    }
    return str
}

const PRECISION = 1e-16

function utoa(n) {
    let str = ''
    const exponent = Math.log10(n)
    if (exponent > 30) return n.toFixed(1 - Math.log10(PRECISION))

    while (n) {
        let digit = n % 10
        str = String.fromCharCode('0'.charCodeAt() + digit) + str
        n = (n - digit) / 10
    }
    if (exponent > 10) {
        let i = str.length - 1
        while (str[i] === '0') i--;
        const strip0 = str.slice(0, i + 1)
        const prefix = strip0.length === 1 ? strip0 : `${strip0[0]}.${strip0.slice(1, 1 - Math.log10(PRECISION))}`
        str = prefix + `e+${str.length - 1}`
    }
    return str
}

function dtoa(f) {
    let str = ''
    let exponent = Math.log10(f)
    if (exponent < -20) return f.toPrecision(1 - Math.log10(PRECISION))
    if (exponent < -16) return f.toPrecision(4)

    const integer = Math.floor(f)
    str += utoa(integer) + '.'
    f -= integer
    while (!Number.isInteger(f) && str.length < 2 - Math.log10(PRECISION)) {
        f *= 10
        const digit = Math.floor(f)
        str += String.fromCharCode('0'.charCodeAt() + digit)
        f -= digit
    }
    return str
}

function stringify_string(string) {
    let str = '\"'
    for (let i = 0; i < string.length; i++) {
        const ch = string[i]

        if (ch === '\n') str += "\\n"
        else if (ch === '\b') str += "\\b"
        else if (ch === '\t') str += "\\t"
        else if (ch === '\f') str += "\\f"
        else if (ch === '\r') str += "\\r"
        else if (ch === '\"') str += '\\"'
        else if (ch === '\\') str += '\\\\'
        else {
            const val = ch.charCodeAt()
            if (!val) {
                str += '\\u0000'
            } else if (val >= 0x000 && val <= 0x007f) {
                str += ch
            } else {
                // TODO:
            }
        }
    }
    return str + '\"'
}

function stringify_array(array) {
    let str = '['

    array.forEach((element, i) => {
        const suffix = i === array.length - 1 ? '' : ','
        str += stringify(element) + suffix
    });

    return str + ']'
}

function stringify_object(obj) {
    let str = '{'

    Object.entries(obj).forEach(([key, value], i) => {
        const suffix = i === Object.keys(obj).length - 1 ? '' : ','
        str += `\"${key}\":${stringify(value)}${suffix}`
    })

    return str + '}'
}

function stringify(value) {
    if (value === null) return 'null'
    if (value === true) return 'true'
    if (value === false) return 'false'

    if (typeof value === 'number') return stringify_number(value)
    if (typeof value === 'string') return stringify_string(value)
    if (value instanceof Array) return stringify_array(value)
    if (typeof value === 'object') return stringify_object(value)
}

module.exports = stringify