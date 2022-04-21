import { Chunk, Literal, OpCode } from './chunk.js';
import Lexer from './lexer.js';
import { Token, TokenType } from './token.js';

enum Precedence {
    None,
    Assignment,
    Or,
    And,
    Equality,
    Comparison,
    Term,
    Factor,
    Unary,
    Call,
    Primary,
}

function nextPrec(prec: Precedence) {
    if (prec + 1 > 10) {
        throw 'No rule higher than Primary';
    }
    return prec + 1;
}

type ParseFunction = (this: Compiler) => void;

class ParseRule {
    constructor(
        public prefix: ParseFunction | null,
        public infix: ParseFunction | null,
        public prec: Precedence,
    ) {}
}

export default class Compiler {
    public chunk: Chunk;
    public errors: string;
    private lexer: Lexer;
    private curr: Token;
    private prev: Token;
    private hadError: boolean;
    private panicMode: boolean;
    private rules: Map<TokenType, ParseRule>;

    constructor(code: string) {
        const rules = new Map([
            [TokenType.LeftParen, new ParseRule(this.group, null, Precedence.None)],
            [TokenType.Plus, new ParseRule(null, this.binary, Precedence.Term)],
            [TokenType.Minus, new ParseRule(this.unary, this.binary, Precedence.Term)],
            [TokenType.Star, new ParseRule(null, this.binary, Precedence.Factor)],
            [TokenType.Slash, new ParseRule(null, this.binary, Precedence.Factor)],
            [TokenType.Number, new ParseRule(this.number, null, Precedence.None)],
        ])

        this.chunk = new Chunk();
        this.errors = '';
        this.lexer = new Lexer(code);
        this.curr = new Token(TokenType.Eof);
        this.prev = new Token(TokenType.Eof);
        this.hadError = false;
        this.panicMode = false;
        this.rules = rules;
    }

    public compile() {
        this.next();
        this.expression();
        this.emit(OpCode.Return);
        this.eat(TokenType.Eof, 'Unenclosed expression');
        return !this.hadError;
    }

    private next() {
        this.prev = this.curr;

        while (true) {
            this.curr = this.lexer.makeToken();
            if (this.curr.id != TokenType.Error) break;

            this.errorCurr(this.curr.value as string);
        }
    }

    private eat(id: TokenType, error: string) {
        if (this.curr.id == id) {
            this.next();
            return;
        }
        this.errorCurr(error);
    }

    private emit(op: OpCode) {
        this.chunk.write(op);
    }

    private emitConstant(value: Literal) {
        const index = this.chunk.addConstant(value);
        this.emit(OpCode.Constant);
        this.emit(index);
    }

    private expression() {
        this.parsePrecedence(Precedence.Assignment);
    }

    private number() {
        this.emitConstant(this.prev.value as number);
    }

    private group() {
        this.expression();
        this.eat(TokenType.RightParen, "Expected closing parenthesis ')'");
    }

    private unary() {
        const operatorId = this.prev.id;
        this.parsePrecedence(Precedence.Unary);

        if (operatorId == TokenType.Minus) {
            this.emit(OpCode.Negate);
        }
    }
    
    private binary() {
        const operatorId = this.prev.id;
        const rule = nextPrec(this.getRule(operatorId).prec);

        this.parsePrecedence(rule);

        switch (operatorId) {
            case TokenType.Plus: return this.emit(OpCode.Add);
            case TokenType.Minus: return this.emit(OpCode.Subtract);
            case TokenType.Star: return this.emit(OpCode.Multiply);
            case TokenType.Slash: return this.emit(OpCode.Divide);
        }
    }

    private parsePrecedence(prec: Precedence) {
        this.next();
        const prefixRule = this.getRule(this.prev.id).prefix;

        if (prefixRule != null) {
            prefixRule.call(this);
        } else {
            return this.error('Expected expression');
        }

        while (prec <= this.getRule(this.curr.id).prec) {
            this.next();
            const infixRule = this.getRule(this.prev.id).infix;

            if (infixRule != null) {
                infixRule.call(this);
            } else {
                return this.error('Unexpected infix rule call');
            }
        }
    }
    
    private getRule(id: TokenType) {
        return this.rules.get(id) ?? new ParseRule(null, null, Precedence.None);
    }

    private errorCurr(message: string) {
        this.errorAt(this.curr, message);
    }

    private error(message: string) {
        this.errorAt(this.prev, message);
    }

    private errorAt(token: Token, message: string) {
        // if (this.panicMode) return;
        this.hadError = true;
        this.panicMode = true;

        this.errors += `Error: ${message}<br>`;
    }
}
