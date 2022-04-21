import Compiler from './compiler.js';
import VM from './vm.js';

export const DEBUG = true;
const box = document.getElementById('input')!;

box.addEventListener('input', () => {
    const value = (document.getElementById('input') as HTMLInputElement).value;
    const [output, result] = runCode(value);
    const resultObj = document.getElementById('result')!;
    resultObj.innerHTML = `${output}`;
    if (!result) {
        resultObj.style.backgroundColor = 'lightcoral';
        resultObj.style.fontWeight = 'normal';
    } else {
        resultObj.style.backgroundColor = 'lightgreen';
        resultObj.style.fontWeight = 'bold';
    }
});

function runCode(code: string) {
    const compiler = new Compiler(code);
    const result = compiler.compile();

    if (result) {
        return [new VM(compiler.chunk).run(), true];
    } else {
        return [compiler.errors, false];
    }
}