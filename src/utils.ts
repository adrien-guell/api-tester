import path from 'path';
import fs, { existsSync, readFileSync } from 'fs';
import stringifyObject from 'stringify-object';
import { defaultConfigFilename } from '../config.json';
import { exec } from 'child_process';

export function getMostRecentFilename(directory: string): string {
    const files = fs.readdirSync(directory);
    const filesCreationTimestamp = files.map((file) => {
        return fs.statSync(path.join(directory, file)).ctime.getTime();
    });
    const maxCreationTimestamp = Math.max(...filesCreationTimestamp);
    return path.join(directory, files[filesCreationTimestamp.indexOf(maxCreationTimestamp)]);
}

export function getBuiltConfigFile(userDefinedConfigPath?: string): Promise<string> {
    const flags = '--resolveJsonModule --downlevelIteration --esModuleInterop';
    const configPath = userDefinedConfigPath ??
        path.join(findFileFolderInCurrentTree(`${defaultConfigFilename}.ts`), `${defaultConfigFilename}.ts`);
    if (!existsSync(configPath)) throw `File not found: ${configPath}`;
    const command = `tsc.cmd ${configPath} ${flags}`;
    const builtConfigPath = configPath.replace('.ts', '.js');
    return new Promise<string>((resolve, reject) => {
        exec(command).on('exit', (code: number) => {
            if (code != 0) reject('Cannot execute command: ' + command);
            resolve(builtConfigPath);
        });
    });
}

export function findFileFolderInCurrentTree(filename: string): string {
    let currentWorkingDirectory = process.cwd();
    let i = 0;
    while (!fs.existsSync(filename) && i < 30) {
        currentWorkingDirectory = path.join(currentWorkingDirectory, '../');
        i++;
    }
    if (i >= 30) throw `Could not find file named ${filename} in the project.`
    return currentWorkingDirectory;
}

export const stringify = (data: any) => stringifyObject(data, {
    indent: '  ',
    singleQuotes: false
});

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function groupBy<T, K>(list: T[], keyGetter: (data: T) => K): Map<K, T[]> {
    const map = new Map<K, T[]>();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}