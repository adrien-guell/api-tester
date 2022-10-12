#!/usr/bin/env node
import { testEndpoints } from './src/testMethods';
import { ApiTesterConfig } from './src/models/ApiTesterConfig';
import { program } from 'commander';
import { Options } from './src/models/Options';
import {getConfigLocation} from "./src/utils";

export { AxiosRequestConfig, Method } from 'axios';
export * from './src/models/ApiTesterConfig';

program
    .name('api-tester')
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
    })
    .parse();
