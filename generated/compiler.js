import { Chunk, OpCode } from './chunk.js';
import Lexer from './lexer.js';
import { Token, TokenType } from './token.js';
var Precedence;
(function (Precedence) {
    Precedence[Precedence["None"] = 0] = "None";
    Precedence[Precedence["Assignment"] = 1] = "Assignment";
    Precedence[Precedence["Or"] = 2] = "Or";
    Precedence[Precedence["And"] = 3] = "And";
    Precedence[Precedence["Equality"] = 4] = "Equality";
    Precedence[Precedence["Comparison"] = 5] = "Comparison";
    Precedence[Precedence["Term"] = 6] = "Term";
    Precedence[Precedence["Factor"] = 7] = "Factor";
    Precedence[Precedence["Unary"] = 8] = "Unary";
    Precedence[Precedence["Call"] = 9] = "Call";
    Precedence[Precedence["Primary"] = 10] = "Primary";
})(Precedence || (Precedence = {}));
function nextPrec(prec) {
    if (prec + 1 > 10) {
        throw 'No rule higher than Primary';
    }
    return prec + 1;
}
class ParseRule {
    constructor(prefix, infix, prec) {
        this.prefix = prefix;
        this.infix = infix;
        this.prec = prec;
    }
}
export default class Compiler {
    constructor(code) {
        const rules = new Map([
            [TokenType.LeftParen, new ParseRule(this.group, null, Precedence.None)],
            [TokenType.Plus, new ParseRule(null, this.binary, Precedence.Term)],
            [TokenType.Minus, new ParseRule(this.unary, this.binary, Precedence.Term)],
            [TokenType.Star, new ParseRule(null, this.binary, Precedence.Factor)],
            [TokenType.Slash, new ParseRule(null, this.binary, Precedence.Factor)],
            [TokenType.Number, new ParseRule(this.number, null, Precedence.None)],
        ]);
        this.chunk = new Chunk();
        this.errors = '';
        this.lexer = new Lexer(code);
        this.curr = new Token(TokenType.Eof);
        this.prev = new Token(TokenType.Eof);
        this.hadError = false;
        this.panicMode = false;
        this.rules = rules;
    }
    compile() {
        this.next();
        this.expression();
        this.emit(OpCode.Return);
        this.eat(TokenType.Eof, 'Unenclosed expression');
        return !this.hadError;
    }
    next() {
        this.prev = this.curr;
        while (true) {
            this.curr = this.lexer.makeToken();
            if (this.curr.id != TokenType.Error)
                break;
            this.errorCurr(this.curr.value);
        }
    }
    eat(id, error) {
        if (this.curr.id == id) {
            this.next();
            return;
        }
        this.errorCurr(error);
    }
    emit(op) {
        this.chunk.write(op);
    }
    emitConstant(value) {
        const index = this.chunk.addConstant(value);
        this.emit(OpCode.Constant);
        this.emit(index);
    }
    expression() {
        this.parsePrecedence(Precedence.Assignment);
    }
    number() {
        this.emitConstant(this.prev.value);
    }
    group() {
        this.expression();
        this.eat(TokenType.RightParen, "Expected closing parenthesis ')'");
    }
    unary() {
        const operatorId = this.prev.id;
        this.parsePrecedence(Precedence.Unary);
        if (operatorId == TokenType.Minus) {
            this.emit(OpCode.Negate);
        }
    }
    binary() {
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
    parsePrecedence(prec) {
        this.next();
        const prefixRule = this.getRule(this.prev.id).prefix;
        if (prefixRule != null) {
            prefixRule.call(this);
        }
        else {
            return this.error('Expected expression');
        }
        while (prec <= this.getRule(this.curr.id).prec) {
            this.next();
            const infixRule = this.getRule(this.prev.id).infix;
            if (infixRule != null) {
                infixRule.call(this);
            }
            else {
                return this.error('Unexpected infix rule call');
            }
        }
    }
    getRule(id) {
        var _a;
        return (_a = this.rules.get(id)) !== null && _a !== void 0 ? _a : new ParseRule(null, null, Precedence.None);
    }
    errorCurr(message) {
        this.errorAt(this.curr, message);
    }
    error(message) {
        this.errorAt(this.prev, message);
    }
    errorAt(token, message) {
        this.hadError = true;
        this.panicMode = true;
        this.errors += `Error: ${message}<br>`;
    }
}
//# sourceMappingURL=compiler.js.map