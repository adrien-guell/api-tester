#!/usr/bin/env node
import { getConfigLocation, testEndpoints } from './src/utils';
import { ApiTesterConfig } from './src/models/ApiTesterConfig';
import { program } from 'commander';
import { Options } from './src/models/Options';

export { AxiosRequestConfig, Method } from 'axios';
export * from './src/models/ApiTesterConfig';

program.name('api-tester');
program
    .description('Test API endpoints with their matching decoders')
    .option('-c, --config <configLocation>', 'Set the config file location')
    .option('-d, --detail', 'Show more details for on error')
    .action(async (options: Options) => {
        const configLocation = options.configLocation ?? getConfigLocation();
        import(configLocation)
            .then((defaultImport) => {
                const config: ApiTesterConfig = defaultImport.default;
                testEndpoints(config);
            })
            .catch(console.error);
    });
program.parse();
