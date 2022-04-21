import { Token, TokenType } from './token.js';
export default class Lexer {
    constructor(code) {
        this.code = code;
        this.start = 0;
        this.curr = 0;
    }
    makeToken() {
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
    skipWhitespace() {
        const skipped = [' ', '\r', '\t', '\n'];
        while (!this.atEnd()) {
            const char = this.peek();
            if (skipped.includes(char)) {
                this.next();
            }
            else {
                return;
            }
        }
    }
    number() {
        while (this.isDigit(this.peek()))
            this.next();
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.next();
            while (this.isDigit(this.peek()))
                this.next();
        }
        return new Token(TokenType.Number, Number(this.code.substring(this.start, this.curr)));
    }
    isDigit(char) {
        return char >= '0' && char <= '9';
    }
    peek() {
        return this.code[this.curr];
    }
    peekNext() {
        return this.code[this.curr + 1];
    }
    next() {
        return this.code[this.curr++];
    }
    atEnd() {
        return this.curr >= this.code.length;
    }
}
//# sourceMappingURL=lexer.js.map