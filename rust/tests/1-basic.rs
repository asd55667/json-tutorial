use my_json::{parse, ParseError, Value};

#[test]
fn parse_value() {
    assert_eq!(parse("null"), Ok(Value::Null));
    assert_eq!(parse("true"), Ok(Value::Bool(true)));
    assert_eq!(parse("false"), Ok(Value::Bool(false)));
}

#[test]
fn parse_expect_value() {
    assert_eq!(parse(""), Err(ParseError::ExpectValue));
    assert_eq!(parse(" "), Err(ParseError::ExpectValue));
}

#[test]
fn parse_invalid_value() {
    assert_eq!(parse("nul"), Err(ParseError::InvalidValue));
    assert_eq!(parse("?"), Err(ParseError::InvalidValue));
}

#[test]
fn parse_root_not_singular() {
    assert_eq!(parse("null x"), Err(ParseError::RootNotSingular));
}
