use my_json::{parse, ParseError, Value};

#[test]
fn parse_number() {
    assert_eq!(parse("0"), Ok(Value::Number(0.0)));
    assert_eq!(parse("-0"), Ok(Value::Number(0.0)));
    assert_eq!(parse("-0.0"), Ok(Value::Number(0.0)));
    assert_eq!(parse("1"), Ok(Value::Number(1.0)));
    assert_eq!(parse("-1"), Ok(Value::Number(-1.0)));
    assert_eq!(parse("1.5"), Ok(Value::Number(1.5)));
    assert_eq!(parse("-1.5"), Ok(Value::Number(-1.5)));
    assert_eq!(parse("3.1416"), Ok(Value::Number(3.1416)));
    assert_eq!(parse("1E10"), Ok(Value::Number(1E10)));
    assert_eq!(parse("1e10"), Ok(Value::Number(1E10)));
    assert_eq!(parse("1E+10"), Ok(Value::Number(1E10)));
    assert_eq!(parse("1E-10"), Ok(Value::Number(1E-10)));
    assert_eq!(parse("-1E10"), Ok(Value::Number(-1E10)));
    assert_eq!(parse("-1e10"), Ok(Value::Number(-1E10)));
    assert_eq!(parse("-1E+10"), Ok(Value::Number(-1E10)));
    assert_eq!(parse("-1E-10"), Ok(Value::Number(-1E-10)));
    assert_eq!(parse("1.234E+10"), Ok(Value::Number(1.234E+10)));
    assert_eq!(parse("1.234E-10"), Ok(Value::Number(1.234E-10)));
    assert_eq!(parse("1e-10000"), Ok(Value::Number(0.0))); /* must underflow */

    assert_eq!(
        parse("1.0000000000000002"),
        Ok(Value::Number(1.0000000000000002))
    ); /* the smallest number > 1 */
    assert_eq!(
        parse("4.9406564584124654e-324"),
        Ok(Value::Number(4.9406564584124654e-324))
    ); /* minimum denormal */
    assert_eq!(
        parse("-4.9406564584124654e-324"),
        Ok(Value::Number(-4.9406564584124654e-324))
    );
    assert_eq!(
        parse("2.2250738585072009e-308"),
        Ok(Value::Number(2.2250738585072009e-308))
    ); /* Max subnormal double */
    assert_eq!(
        parse("-2.2250738585072009e-308"),
        Ok(Value::Number(-2.2250738585072009e-308))
    );
    assert_eq!(
        parse("2.2250738585072014e-308"),
        Ok(Value::Number(2.2250738585072014e-308))
    ); /* Min normal positive double */
    assert_eq!(
        parse("-2.2250738585072014e-308"),
        Ok(Value::Number(-2.2250738585072014e-308))
    );
    assert_eq!(
        parse("1.7976931348623157e+308"),
        Ok(Value::Number(1.7976931348623157e+308))
    ); /* Max double */
    assert_eq!(
        parse("-1.7976931348623157e+308"),
        Ok(Value::Number(-1.7976931348623157e+308))
    );
}

#[test]
fn parse_invalid_number() {
    assert_eq!(parse("+0"), Err(ParseError::InvalidValue));
    assert_eq!(parse("+1"), Err(ParseError::InvalidValue));
    assert_eq!(parse(".123"), Err(ParseError::InvalidValue));
    assert_eq!(parse("1."), Err(ParseError::InvalidValue));
    assert_eq!(parse("INF"), Err(ParseError::InvalidValue));
    assert_eq!(parse("inf"), Err(ParseError::InvalidValue));
    assert_eq!(parse("NAN"), Err(ParseError::InvalidValue));
    assert_eq!(parse("nan"), Err(ParseError::InvalidValue));
}

#[test]
fn parse_root_not_singular() {
    assert_eq!(parse("0123"), Err(ParseError::RootNotSingular));
    assert_eq!(parse("0x0"), Err(ParseError::RootNotSingular));
    assert_eq!(parse("0x123"), Err(ParseError::RootNotSingular));
}

#[test]
fn parse_number_too_big() {
    assert_eq!(parse("1e309"), Err(ParseError::NumberTooBig));
    assert_eq!(parse("-1e309"), Err(ParseError::NumberTooBig));
}
