export class Token {
    constructor(
        public id: TokenType,
        public value?: number | string,
    ) {}
}

export enum TokenType {
    LeftParen,
    RightParen,

    Comma,
    Dot,
    Plus,
    Minus,
    Star,
    Slash,
    Percent,

    Number,

    Return,
    Error,
    Eof,
}
