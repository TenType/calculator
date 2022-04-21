export type Literal = number;

export enum OpCode {
    Constant,
    Add,
    Subtract,
    Multiply,
    Divide,
    Modulus,
    Negate,
    Return,
}

export class Chunk {
    public constants: Literal[];
    public bytes: OpCode[];

    constructor() {
        this.constants = [];
        this.bytes = [];
    }

    public write(byte: OpCode) {
        this.bytes.push(byte);
    }

    public addConstant(value: Literal) {
        this.constants.push(value);
        return this.constants.length - 1;
    }

    public dissassemble(name: string) {
        console.debug(`== ${name} ==`);
        for (const [i, item] of this.bytes.entries()) {
            this.dissassembleOp(item, i);
        }
    }

    public dissassembleOp(op: OpCode, i: number) {
        let output = i <= 9999 ? `000${i}`.slice(-4) : i;
        output += '    | ';
        switch (op) {
            case OpCode.Constant: {
                const op = this.bytes[i+1];
                output += `LOAD_CONST          ${op} (${this.constants[op]})`;
                break;
            }
            case OpCode.Add: output += 'ADD'; break;
            case OpCode.Subtract: output += 'SUBTRACT'; break;
            case OpCode.Multiply: output += 'MULTIPLY'; break;
            case OpCode.Divide: output += 'DIVIDE'; break;
            case OpCode.Modulus: output += 'MODULUS'; break;
            case OpCode.Negate: output += 'NEGATE'; break;
            case OpCode.Return: output += 'RETURN'; break;
        }
        console.debug(output);
    }
}
