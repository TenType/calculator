import { OpCode } from './chunk.js';
import { DEBUG } from './main.js';
export default class VM {
    constructor(chunk) {
        this.chunk = chunk;
        this.ip = 0;
        this.stack = [];
    }
    next() {
        const op = this.chunk.bytes[this.ip];
        this.ip++;
        return op;
    }
    push(value) {
        this.stack.push(value);
    }
    pop() {
        return this.stack.pop();
    }
    binaryOp(op) {
        const b = this.pop();
        const a = this.pop();
        this.push(op(a, b));
    }
    disassemble(op) {
        if (this.stack.length > 0) {
            let output = '        | ';
            for (const item of this.stack) {
                output += `[ ${item} ]`;
            }
            console.debug(output);
        }
        this.chunk.dissassembleOp(op, this.ip - 1);
    }
    run() {
        while (true) {
            const op = this.next();
            if (DEBUG)
                this.disassemble(op);
            switch (op) {
                case OpCode.Constant: {
                    const byte = this.chunk.bytes[this.ip++];
                    const value = this.chunk.constants[byte];
                    this.push(value);
                    break;
                }
                case OpCode.Add: {
                    this.binaryOp((a, b) => a + b);
                    break;
                }
                case OpCode.Subtract: {
                    this.binaryOp((a, b) => a - b);
                    break;
                }
                case OpCode.Multiply: {
                    this.binaryOp((a, b) => a * b);
                    break;
                }
                case OpCode.Divide: {
                    this.binaryOp((a, b) => a / b);
                    break;
                }
                case OpCode.Negate: {
                    const value = -this.pop();
                    this.push(value);
                }
                case OpCode.Return: {
                    return this.pop();
                }
            }
        }
    }
}
//# sourceMappingURL=vm.js.map