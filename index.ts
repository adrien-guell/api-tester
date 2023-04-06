#!/usr/bin/env node
import {runTests} from './src/business/testMethods';
import {ApiTesterConfig} from './src/business/models/ApiTesterConfig';
import {program} from 'commander';
import {Options} from './src/business/models/Options';
import {writeLogs} from './src/presentation/logger';
import {printResults} from './src/presentation/printer';
import {writeHtmlReport} from './src/presentation/htmlGenerator';
import {getBuiltConfigFile, getExitCode} from './src/utils';
import * as path from 'path';
import {rm} from 'fs/promises';

export {AxiosRequestConfig, Method} from 'axios';
export * from './src/business/models/ApiTesterConfig';

program
    .name('api-tester')
    .description('Test API endpoints with their matching decoders')
    .option('-c, --config <configPath>', 'Set the config file path')
    .option('-v, --verbose', 'Prints more detailed stacktrace')
    .option('-r, --report [reportFilename]', 'Generate an html report file')
    .action(async (options: Options) => {
        getBuiltConfigFile(options.config)
            .then(async (configPath) => {
                const exitCode = await import(configPath)
                    .then(async (defaultImport) => {
                        const config = defaultImport.default;
                        const testResults = await runTests(config);
                        writeLogs(testResults);
                        if (options.report) {
                            if (options.report == true) writeHtmlReport(testResults, undefined);
                            else writeHtmlReport(testResults, options.report);
                        }
                        printResults(testResults, options.verbose);
                        return getExitCode(testResults);
                    })
                    .catch((error) => {
                        console.error(error);
                        return 1;
                    });

                rm(path.parse(configPath).dir, { recursive: true })
                    .then(() => {
                        process.exit(exitCode);
                    })
                    .catch(console.error);
            })
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    })
    .parse();
