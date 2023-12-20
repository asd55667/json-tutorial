use std::collections::HashMap;

use my_json::{parse, ParseError, Value};

#[test]
fn parse_object() {
    assert_eq!(parse("{}"), Ok(Value::Object(HashMap::new())));

    assert_eq!(
        parse(
            "{
                \"n\" : null , 
                \"f\" : false , 
                \"t\" : true , 
                \"i\" : 123 , 
                \"s\" : \"abc\", 
                \"a\" : [ 1, 2, 3 ],
                \"o\" : { \"1\" : 1, \"2\" : 2, \"3\" : 3 }
            }"
        ),
        Ok(Value::Object(HashMap::from([
            ("n", Value::Null),
            ("f", Value::Bool(false)),
            ("t", Value::Bool(true)),
            ("i", Value::Number(123 as f64)),
            ("s", Value::String("abc")),
            (
                "a",
                Value::Array(vec![
                    Value::Number(1 as f64),
                    Value::Number(2 as f64),
                    Value::Number(3 as f64)
                ])
            ),
            (
                "o",
                Value::Object(HashMap::from([
                    ("1", Value::Number(1 as f64)),
                    ("2", Value::Number(2 as f64)),
                    ("3", Value::Number(3 as f64)),
                ]))
            )
        ])))
    );

    assert_eq!(
        parse("{\"a\":{\"b\":{\"c\":1}}}"),
        Ok(Value::Object(HashMap::from([(
            "a",
            Value::Object(HashMap::from([(
                "b",
                Value::Object(HashMap::from([("c", Value::Number(1.0))]))
            )]))
        )])))
    );
}

#[test]
fn parse_miss_key() {
    assert_eq!(parse("{:1,"), Err(ParseError::MissKey));
    assert_eq!(parse("{1:1,"), Err(ParseError::MissKey));
    assert_eq!(parse("{true:1,"), Err(ParseError::MissKey));
    assert_eq!(parse("{false:1,"), Err(ParseError::MissKey));
    assert_eq!(parse("{null:1,"), Err(ParseError::MissKey));
    assert_eq!(parse("{[]:1,"), Err(ParseError::MissKey));
    assert_eq!(parse("{{}:1,"), Err(ParseError::MissKey));
    assert_eq!(parse("{\"a\":1,"), Err(ParseError::MissKey));
}

#[test]
fn parse_miss_colon() {
    assert_eq!(parse("{\"a\"}"), Err(ParseError::MissColon));
    assert_eq!(parse("{\"a\",\"b\"}"), Err(ParseError::MissColon));
}

#[test]
fn parse_miss_comma_or_curly_bracket() {
    assert_eq!(parse("{\"a\":1"), Err(ParseError::MissCommaOrCurlyBracket));
    assert_eq!(parse("{\"a\":1]"), Err(ParseError::MissCommaOrCurlyBracket));
    assert_eq!(
        parse("{\"a\":1 \"b\""),
        Err(ParseError::MissCommaOrCurlyBracket)
    );
    assert_eq!(parse("{\"a\":{}"), Err(ParseError::MissCommaOrCurlyBracket));
}
