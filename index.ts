#!/usr/bin/env node
import { testEndpoints } from './src/business/testMethods';
import { ApiTesterConfig } from './src/business/models/ApiTesterConfig';
import { program } from 'commander';
import { Options } from './src/business/models/Options';
import { writeLogs } from './src/presentation/logger';
import { printResults } from './src/presentation/printer';
import { rm } from 'fs';
import { writeHtmlReport } from './src/presentation/htmlGenerator';
import { getBuiltConfigFile, getExitCode } from './src/utils';

export { AxiosRequestConfig, Method } from 'axios';
export * from './src/business/models/ApiTesterConfig';

program
    .name('api-tester')
    .description('Test API endpoints with their matching decoders')
    .option('-c, --config <configPath>', 'Set the config file path')
    .option('-v, --verbose', 'Prints more detailed stacktrace')
    .option('-r, --report <reportFilename>', 'Generate an html report file')
    .action(async (options: Options) => {
        getBuiltConfigFile(options.config)
            .then(async (configPath) => {
                const exitCode = await import(configPath)
                    .then(async (defaultImport) => {
                        const config: ApiTesterConfig = defaultImport.default;
                        const testResults = await testEndpoints(config);
                        writeLogs(testResults);
                        if (options.report) {
                            writeHtmlReport(testResults, options.report);
                        }
                        printResults(testResults, options.verbose);
                        return getExitCode(testResults);
                    })
                    .catch((error) => {
                        console.error(error);
                        return 1;
                    });
                rm(configPath, (error) => {
                    if (error) console.error(error);
                });
                process.exit(exitCode);
            })
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    })
    .parse();