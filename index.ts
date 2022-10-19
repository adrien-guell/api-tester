#!/usr/bin/env node
import {testEndpoints} from './src/business/testMethods';
import {ApiTesterConfig} from './src/business/models/ApiTesterConfig';
import {program} from 'commander';
import {Options} from './src/business/models/Options';
import {getConfigPath} from './src/utils';
import {writeLogs} from './src/presentation/logger';
import {printResults} from './src/presentation/printer';
import {writeHtmlReport} from './src/presentation/htmlGenerator';

export {AxiosRequestConfig, Method} from 'axios';
export * from './src/business/models/ApiTesterConfig';

program
    .name('api-tester')
    .description('Test API endpoints with their matching decoders')
    .option('-c, --config <configPath>', 'Set the config file path')
    .option('-v, --verbose', 'Prints more detailed stacktrace')
    .option('-r, --report <reportFilename>', 'Generate an html report file')
    .action(async (options: Options) => {
        const {exec} = require('child_process');
        const cmd =
            'tsc.cmd apitester-config.ts --outDir lib --resolveJsonModule --downlevelIteration --esModuleInterop';
        exec(cmd).on('exit', (code: number) => {
            if (code != 0) throw new Error('Cannot execute command: ' + cmd);

            const configPath = options.configPath ?? getConfigPath('apitester-config.js');
            import(configPath)
                .then(async (defaultImport) => {
                    const config: ApiTesterConfig = defaultImport.default;
                    const testResults = await testEndpoints(config);
                    printResults(testResults, options.verbose);
                    writeLogs(testResults);
                    console.log(options.reportFilename)
                    writeHtmlReport(testResults, options.reportFilename);
                })
                .catch(console.error);
        });
    })
    .parse();
