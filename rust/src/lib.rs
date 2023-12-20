use std::collections::HashMap;

#[derive(Debug, PartialEq)]
pub enum ParseError {
    ExpectValue,
    InvalidValue,
    RootNotSingular,
    NumberTooBig,
    MissQuotationMark,
    InvalidStringEscape,
    InvalidStringChar,
    InvalidUnicodeHex,
    InvalidUnicodeSurrogate,
    MissCommaOrSquareBracket,
    MissKey,
    MissColon,
    MissCommaOrCurlyBracket,
}

#[derive(Debug, PartialEq)]
pub enum Value<'a> {
    Null,
    Bool(bool),
    Number(f64),
    String(&'a str),
    Array(Vec<Value<'a>>),
    Object(HashMap<&'a str, Value<'a>>),
}

pub fn parse<'a>(_s: &str) -> Result<Value<'a>, ParseError> {
    // TODO: implement to parse json string
    println!("Hello, world!");
    Ok(Value::Null)
}

pub fn stringify() {
    // TODO: implement to stringify json string
    println!("Hello, world!");
}
