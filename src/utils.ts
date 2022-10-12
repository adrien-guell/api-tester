import path from 'path';
import fs, { readFileSync } from 'fs';

export function getMostRecentFilename(directory: string): string {
    const files = fs.readdirSync(directory);
    const filesCreationTimestamp = files.map((file) => {
        return fs.statSync(path.join(directory, file)).ctime.getTime();
    });
    const maxCreationTimestamp = Math.max(...filesCreationTimestamp);
    return files[filesCreationTimestamp.indexOf(maxCreationTimestamp)]
}

export function getConfigLocation(configFilename: string): string {
    let currentWorkingDirectory = process.cwd();
    const basefile: string = './tsconfig.json';
    while (!fs.existsSync(basefile)) {
        currentWorkingDirectory = path.join(currentWorkingDirectory, '../');
    }
    let file: string = readFileSync(`${currentWorkingDirectory}\\tsconfig.json`, 'utf8');
    file = file.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
    const outDir = JSON.parse(file).compilerOptions.outDir ?? '';
    return path.join(currentWorkingDirectory, outDir, configFilename);
}
