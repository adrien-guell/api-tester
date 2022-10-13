#!/usr/bin/env node
import { testEndpoints } from './src/business/testMethods';
import { ApiTesterConfig } from './src/business/models/ApiTesterConfig';
import { program } from 'commander';
import { Options } from './src/business/models/Options';
import { getConfigLocation } from './src/utils';
import { testResultsToLogsData, getLogPath, writeLogs } from './src/presentation/logger';
import { stringify } from './src/utils';
import { printResults } from './src/presentation/printer';

export { AxiosRequestConfig, Method } from 'axios';
export * from './src/business/models/ApiTesterConfig';

program
    .name('api-tester')
    .description('Test API endpoints with their matching decoders')
    .option('-c, --config <configLocation>', 'Set the config file location')
    .option('-v, --verbose', 'Prints more detailed stacktrace')
    .action(async (options: Options) => {
        const configLocation = options.configLocation ?? getConfigLocation('apitester-config.js');
        import(configLocation)
            .then(async (defaultImport) => {
                const config: ApiTesterConfig = defaultImport.default;
                const testResults = await testEndpoints(config);
                printResults(testResults, options.verbose);
                writeLogs(testResults);
            })
            .catch(console.error);
    })
    .parse();
