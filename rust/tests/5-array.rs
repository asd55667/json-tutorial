use my_json::{parse, ParseError, Value};

#[test]
fn parse_array() {
    assert_eq!(parse("[]"), Ok(Value::Array(vec![])));
    assert_eq!(
        parse("[null,false,true,123,\"abc\"]"),
        Ok(Value::Array(vec![
            Value::Null,
            Value::Bool(false),
            Value::Bool(true),
            Value::Number(123 as f64),
            Value::String("abc")
        ]))
    );
    assert_eq!(
        parse("[ [ ] , [ 0 ] , [ 0 , 1 ] , [ 0 , 1 , 2 ] ]"),
        Ok(Value::Array(vec![
            Value::Array(vec![]),
            Value::Array(vec![Value::Number(0 as f64)]),
            Value::Array(vec![Value::Number(0 as f64), Value::Number(1 as f64)]),
            Value::Array(vec![
                Value::Number(0 as f64),
                Value::Number(1 as f64),
                Value::Number(2 as f64)
            ])
        ]))
    );
}

#[test]
fn parse_invalid_array() {
    assert_eq!(parse("[1,]"), Err(ParseError::InvalidValue));
    assert_eq!(parse("[\"a\", nul]"), Err(ParseError::InvalidValue));
}

#[test]
fn parse_miss_comma_or_square_bracket() {
    assert_eq!(parse("[1"), Err(ParseError::MissCommaOrSquareBracket));
    assert_eq!(parse("[1}"), Err(ParseError::MissCommaOrSquareBracket));
    assert_eq!(parse("[1 2"), Err(ParseError::MissCommaOrSquareBracket));
    assert_eq!(parse("[[]"), Err(ParseError::MissCommaOrSquareBracket));
}
