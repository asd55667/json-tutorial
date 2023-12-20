use my_json::{parse, ParseError, Value};

#[test]
fn parse_string() {
    assert_eq!(parse("\"\""), Ok(Value::String("")));
    assert_eq!(parse("\"Hello\""), Ok(Value::String("Hello")));
    assert_eq!(
        parse("\"Hello\\nWorld\""),
        Ok(Value::String("Hello\nWorld"))
    );
    assert_eq!(
        parse("\"\\\" \\\\ / \\b \\f \\n \\r \\t\""),
        Ok(Value::String("\" \\ / \x08 \x0c \n \r \t"))
    );
}

#[test]
fn parse_invalid_string_escape() {
    assert_eq!(parse("\"\\v\""), Err(ParseError::InvalidStringEscape));
    assert_eq!(parse("\"\\'\""), Err(ParseError::InvalidStringEscape));
    assert_eq!(parse("\"\\0\""), Err(ParseError::InvalidStringEscape));
    assert_eq!(parse("\"\\x12\""), Err(ParseError::InvalidStringEscape));
}

#[test]
fn parse_invalid_string_char() {
    assert_eq!(parse("\"\x01\""), Err(ParseError::InvalidStringChar));
    assert_eq!(parse("\"\x1F\""), Err(ParseError::InvalidStringChar));
}
