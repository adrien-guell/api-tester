#!/usr/bin/env node
import { testEndpoints } from './src/business/testMethods';
import { ApiTesterConfig } from './src/business/models/ApiTesterConfig';
import { program } from 'commander';
import { Options } from './src/business/models/Options';
import { writeLogs } from './src/presentation/logger';
import { printResults } from './src/presentation/printer';
import { rm } from 'fs';
import { writeHtmlReport } from './src/presentation/htmlGenerator';
import { getBuiltConfigFile } from './src/utils';

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
                await import(configPath)
                    .then(async (defaultImport) => {
                        const config: ApiTesterConfig = defaultImport.default;
                        const testResults = await testEndpoints(config);
                        writeLogs(testResults);
                        if (options.report) {
                            writeHtmlReport(testResults, options.report);
                        }
                        printResults(testResults, options.verbose);
                    })
                    .catch(console.error);
                rm(configPath, err => {
                    if (err) console.error(err);
                });
            }).catch(console.error);
    })
    .parse();
