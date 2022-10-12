#!/usr/bin/env node
import { testEndpoints } from './src/business/testMethods';
import { ApiTesterConfig } from './src/business/models/ApiTesterConfig';
import { program } from 'commander';
import { Options } from './src/business/models/Options';
import { getConfigLocation } from './src/utils';

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
            .then((defaultImport) => {
                const config: ApiTesterConfig = defaultImport.default;
                testEndpoints(config);
            })
            .catch(console.error);
    })
    .parse();
