export var OpCode;
(function (OpCode) {
    OpCode[OpCode["Constant"] = 0] = "Constant";
    OpCode[OpCode["Add"] = 1] = "Add";
    OpCode[OpCode["Subtract"] = 2] = "Subtract";
    OpCode[OpCode["Multiply"] = 3] = "Multiply";
    OpCode[OpCode["Divide"] = 4] = "Divide";
    OpCode[OpCode["Modulus"] = 5] = "Modulus";
    OpCode[OpCode["Negate"] = 6] = "Negate";
    OpCode[OpCode["Return"] = 7] = "Return";
})(OpCode || (OpCode = {}));
export class Chunk {
    constructor() {
        this.constants = [];
        this.bytes = [];
    }
    write(byte) {
        this.bytes.push(byte);
    }
    addConstant(value) {
        this.constants.push(value);
        return this.constants.length - 1;
    }
    dissassemble(name) {
        console.debug(`== ${name} ==`);
        for (const [i, item] of this.bytes.entries()) {
            this.dissassembleOp(item, i);
        }
    }
    dissassembleOp(op, i) {
        let output = i <= 9999 ? `000${i}`.slice(-4) : i;
        output += '    | ';
        switch (op) {
            case OpCode.Constant: {
                const op = this.bytes[i + 1];
                output += `LOAD_CONST          ${op} (${this.constants[op]})`;
                break;
            }
            case OpCode.Add:
                output += 'ADD';
                break;
            case OpCode.Subtract:
                output += 'SUBTRACT';
                break;
            case OpCode.Multiply:
                output += 'MULTIPLY';
                break;
            case OpCode.Divide:
                output += 'DIVIDE';
                break;
            case OpCode.Modulus:
                output += 'MODULUS';
                break;
            case OpCode.Negate:
                output += 'NEGATE';
                break;
            case OpCode.Return:
                output += 'RETURN';
                break;
        }
        console.debug(output);
    }
}
//# sourceMappingURL=chunk.js.map