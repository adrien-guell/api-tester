import path from 'path';
import fs, { readFileSync } from 'fs';
import stringifyObject from 'stringify-object';

export function getMostRecentFilename(directory: string): string {
    const files = fs.readdirSync(directory);
    const filesCreationTimestamp = files.map((file) => {
        return fs.statSync(path.join(directory, file)).ctime.getTime();
    });
    const maxCreationTimestamp = Math.max(...filesCreationTimestamp);
    return path.join(directory, files[filesCreationTimestamp.indexOf(maxCreationTimestamp)]);
}

export function getConfigPath(configPath: string): string {
    let currentWorkingDirectory = process.cwd();
    const basefile: string = './tsconfig.json';
    while (!fs.existsSync(basefile)) {
        currentWorkingDirectory = path.join(currentWorkingDirectory, '../');
    }
    return path.join(currentWorkingDirectory, configPath);
}

export const stringify = (data: any) => stringifyObject(data, {
    indent: '  ',
    singleQuotes: false
});

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function groupBy<T, K>(list: T[], keyGetter: (data: T) => K) {
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