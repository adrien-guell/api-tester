import * as path from 'path';
import fs, { existsSync, readdirSync, statSync } from 'fs';
import stringifyObject from 'stringify-object';
import * as config from '../config.json';
import { execSync } from 'child_process';
import { TestResult } from './business/models/TestResult';

export function getMostRecentFilename(directory: string): string {
    const files = readdirSync(directory);
    const filesCreationTimestamp = files.map((file) => {
        return statSync(path.join(directory, file)).ctime.getTime();
    });
    const maxCreationTimestamp = Math.max(...filesCreationTimestamp);
    return path.join(directory, files[filesCreationTimestamp.indexOf(maxCreationTimestamp)]);
}

export function getBuiltConfigFile(userDefinedConfigPath?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const flags = '--resolveJsonModule --downlevelIteration --esModuleInterop --strict';

        const projectRootFolder = findFileFolderInCurrentTree('package.json');
        const configPath =
            userDefinedConfigPath ??
            path.join(projectRootFolder, `${config.defaultConfigFilename}.ts`);
        if (!existsSync(configPath)) reject(`File not found: ${configPath}`);

        if (!fs.existsSync(config.defaultBuildFolder)) {
            fs.mkdirSync(config.defaultBuildFolder, { recursive: true });
        }
        const command = `npx tsc --outDir ${config.defaultBuildFolder} ${configPath} ${flags}`;
        const builtConfigPath = path.join(
            projectRootFolder,
            config.defaultBuildFolder,
            `${config.defaultConfigFilename}.js`,
        );
        try {
            execSync(command, { stdio: 'inherit' });
            resolve(builtConfigPath);
        } catch (error) {
            reject(error);
        }
    });
}

export function findFileFolderInCurrentTree(filename: string): string {
    let currentWorkingDirectory = process.cwd();
    let i = 0;
    while (!existsSync(path.join(currentWorkingDirectory, filename)) && i < 30) {
        currentWorkingDirectory = path.join(currentWorkingDirectory, '../');
        i++;
    }
    if (i >= 30) throw `Could not find file named ${filename} in the project.`;
    return currentWorkingDirectory;
}

export const stringify = (data: any) =>
    stringifyObject(data, {
        indent: '  ',
        singleQuotes: false,
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

export function getExitCode(testResults: TestResult<unknown>[]) {
    return testResults.find(
        (testResult) => testResult.complementaryData.status != 'success',
    )
        ? 1
        : 0;
}
