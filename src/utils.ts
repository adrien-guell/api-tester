import {readFileSync} from "fs";
import path from "path";

export function getConfigLocation() {
    let currentWorkingDirectory = process.cwd();
    const basefile: string = './tsconfig.json';
    while (!fs.existsSync(basefile)) {
        currentWorkingDirectory = path.join(currentWorkingDirectory, '../');
    }
    let file: string = readFileSync(`${currentWorkingDirectory}\\tsconfig.json`, 'utf8');
    file = file.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
    const outDir = JSON.parse(file).compilerOptions.outDir ?? '';
    return path.join(currentWorkingDirectory, outDir, 'apitester-config.js');
}
