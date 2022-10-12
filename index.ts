#!/usr/bin/env node
import { testEndpoints } from './src/business/testMethods';
import { ApiTesterConfig } from './src/business/models/ApiTesterConfig';
import { program } from 'commander';
import { Options } from './src/business/models/Options';
import { getConfigLocation } from './src/utils';
import { generateLogsDataFromTestResults, getLogPath, writeLogs } from './src/presentation/logger';
import { stringify } from './src/utils';

export { AxiosRequestConfig, Method } from 'axios';
export * from './src/business/models/ApiTesterConfig';

program
    .name('api-tester')
    .description('Test API endpoints with their matching decoders')
    .option('-c, --config <configLocation>', 'Set the config file location')
    .option('-d, --detail', 'Show more details for on error')
    .action(async (options: Options) => {
        const configLocation = options.configLocation ?? getConfigLocation('apitester-config.js');
        import(configLocation)
            .then(async (defaultImport) => {
                const config: ApiTesterConfig = defaultImport.default;
                const testResults = await testEndpoints(config);
                const logsData = generateLogsDataFromTestResults(testResults);
                writeLogs(logsData, getLogPath());
            })
            .catch(console.error);
    })
    .parse();
