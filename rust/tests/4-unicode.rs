use my_json::{parse, ParseError, Value};

#[test]
fn parse_string() {
    assert_eq!(
        parse("\"Hello\\u0000World\""),
        Ok(Value::String("Hello\0World"))
    );
    assert_eq!(parse("\"\\u0024\""), Ok(Value::String("$"))); /* Dollar sign U+0024 "\xC2\xA2" */
    assert_eq!(parse("\"\\u00A2\""), Ok(Value::String("¢"))); /* Cents sign U+00A2 "\xE2\x82\xAC" */
    assert_eq!(parse("\"\\u20AC\""), Ok(Value::String("€"))); /* Euro sign U+20AC */
    assert_eq!(parse("\"\\uD834\\uDD1E\""), Ok(Value::String("𝄞"))); /* G clef sign U+1D11E "\xF0\x9D\x84\x9E" */
    assert_eq!(parse("\"\\ud834\\udd1e\""), Ok(Value::String("𝄞"))); /* G clef sign U+1D11E "\xF0\x9D\x84\x9E" */
}

#[test]
fn parse_invalid_unicode_hex() {
    assert_eq!(parse("\"\\u\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u0\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u01\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u012\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u/000\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\uG000\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u0/00\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u0G00\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u0/00\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u00G0\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u000/\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u000G\""), Err(ParseError::InvalidUnicodeHex));
    assert_eq!(parse("\"\\u 123\""), Err(ParseError::InvalidUnicodeHex));
}

#[test]
fn parse_invalid_unicode_surrogate() {
    assert_eq!(
        parse("\"\\uD800\""),
        Err(ParseError::InvalidUnicodeSurrogate)
    );
    assert_eq!(
        parse("\"\\uDBFF\""),
        Err(ParseError::InvalidUnicodeSurrogate)
    );
    assert_eq!(
        parse("\"\\uD800\\\\\""),
        Err(ParseError::InvalidUnicodeSurrogate)
    );
    assert_eq!(
        parse("\"\\uD800\\uDBFF\""),
        Err(ParseError::InvalidUnicodeSurrogate)
    );
    assert_eq!(
        parse("\"\\uD800\\uE000\""),
        Err(ParseError::InvalidUnicodeSurrogate)
    );
}
