import { Token, TokenType } from './token.js';

export default class Lexer {
    private start: number;
    private curr: number;

    constructor(private code: string) {
        this.start = 0;
        this.curr = 0;
    }

    public makeToken() {
        this.skipWhitespace();
        this.start = this.curr;
        if (this.atEnd()) {
            return new Token(TokenType.Eof);
        }

        const char = this.next();

        if (this.isDigit(char)) {
            return this.number();
        }

        switch (char) {
            case '(': return new Token(TokenType.LeftParen);
            case ')': return new Token(TokenType.RightParen);
            case ',': return new Token(TokenType.Comma);
            case '.': return new Token(TokenType.Dot);

            case '+': return new Token(TokenType.Plus);
            case '-': return new Token(TokenType.Minus);
            case '*': return new Token(TokenType.Star);
            case '/': return new Token(TokenType.Slash);
            case '%': return new Token(TokenType.Percent);
        }

        return new Token(TokenType.Error, `Unknown character: ${char}`);
    }

    private skipWhitespace() {
        const skipped = [' ', '\r', '\t', '\n'];
        while (!this.atEnd()) {
            const char = this.peek();
            if (skipped.includes(char)) {
                this.next();
            } else {
                return;
            }
        }
    }

    private number() {
        while (this.isDigit(this.peek())) this.next();

        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.next();
            while (this.isDigit(this.peek())) this.next();
        }

        return new Token(TokenType.Number, Number(this.code.substring(this.start, this.curr)));
    }

    private isDigit(char: string) {
        return char >= '0' && char <= '9';
    }

    private peek() {
        return this.code[this.curr];
    }

    private peekNext() {
        return this.code[this.curr + 1];
    }

    private next() {
        return this.code[this.curr++];
    }

    private atEnd() {
        return this.curr >= this.code.length;
    }
}
