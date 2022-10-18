#!/usr/bin/env node
import { testEndpoints } from './src/business/testMethods';
import { ApiTesterConfig } from './src/business/models/ApiTesterConfig';
import { program } from 'commander';
import { Options } from './src/business/models/Options';
import { getConfigPath } from './src/utils';
import { writeLogs } from './src/presentation/logger';
import { printResults } from './src/presentation/printer';
import { defaultConfigFilename, buildFolder } from './config.json';
import { rm } from 'fs';
import { writeHtmlReport } from './src/presentation/htmlGenerator';

export { AxiosRequestConfig, Method } from 'axios';
export * from './src/business/models/ApiTesterConfig';

program
    .name('api-tester')
    .description('Test API endpoints with their matching decoders')
    .option('-c, --config <configPath>', 'Set the config file path')
    .option('-v, --verbose', 'Prints more detailed stacktrace')
    .option('-r, --report <reportFilename>', 'Generate an html report file')
    .action(async (options: Options) => {
        const { exec } = require('child_process');
        const flags = '--resolveJsonModule --downlevelIteration --esModuleInterop';
        const buildFile = options.configLocation ?? defaultConfigFilename;
        const cmd =
            'tsc.cmd ' + buildFile + '.ts --outDir ' + buildFolder + '/ ' + flags;
        exec(cmd).on('exit', (code: number) => {
            if (code != 0) throw new Error('Cannot execute command: ' + cmd);

            const configPath = options.configPath ?? getConfigPath(buildFolder + '/' + defaultConfigFilename + '.js');
            import(configPath)
                .then(async (defaultImport) => {
                    const config: ApiTesterConfig = defaultImport.default;
                    const testResults = await testEndpoints(config);
                    writeLogs(testResults);
                    if (options.reportFilename) {
                        writeHtmlReport(testResults, options.reportFilename);
                    }
                    printResults(testResults, options.verbose);

                    // Get the path of generated folder and delete all its content
                    rm(configLocation.replace(/\\[^\\]+$/, ""), { recursive: true }, err => {
                        if (err) {
                            throw err;
                        }
                    })
                    })
                .catch(console.error);
        });
    })
    .parse();
