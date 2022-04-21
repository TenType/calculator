export class Token {
    constructor(id, value) {
        this.id = id;
        this.value = value;
    }
}
export var TokenType;
(function (TokenType) {
    TokenType[TokenType["LeftParen"] = 0] = "LeftParen";
    TokenType[TokenType["RightParen"] = 1] = "RightParen";
    TokenType[TokenType["Comma"] = 2] = "Comma";
    TokenType[TokenType["Dot"] = 3] = "Dot";
    TokenType[TokenType["Plus"] = 4] = "Plus";
    TokenType[TokenType["Minus"] = 5] = "Minus";
    TokenType[TokenType["Star"] = 6] = "Star";
    TokenType[TokenType["Slash"] = 7] = "Slash";
    TokenType[TokenType["Percent"] = 8] = "Percent";
    TokenType[TokenType["Number"] = 9] = "Number";
    TokenType[TokenType["Return"] = 10] = "Return";
    TokenType[TokenType["Error"] = 11] = "Error";
    TokenType[TokenType["Eof"] = 12] = "Eof";
})(TokenType || (TokenType = {}));
//# sourceMappingURL=token.js.map