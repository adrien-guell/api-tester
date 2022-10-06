#!/usr/bin/env node
import {testEndpoints} from "./src/endpointTest";
import {ApiTesterConfig} from "./src/models/ApiTesterConfig";
import {program} from "commander";
import {readFileSync} from "fs";
import * as path from "path";

export * from "./src/models/ApiTesterConfig";

export type Options = {
    configLocation?: string,
    detail: boolean
}

program.name('api-tester');
program.description('Test API endpoints with their matching decoders')
    .option('-c, --config \<configLocation\>', 'Set the config file location')
    .option('-d, --detail', 'Show more details for on error')
    .action(async (options: Options) => {
            const currentWorkingDirectory = process.cwd();
            const file: string = readFileSync(`${currentWorkingDirectory}\\tsconfig.json`, "utf8");
            const outDir = JSON.parse(file).compilerOptions.outDir ?? "";
            let configLocation = options.configLocation;
            if (!configLocation) {
                configLocation = path.join(currentWorkingDirectory, outDir, "apitester-config.js");
            }

            import(configLocation)
                .then((defaultImport) => {
                    const config: ApiTesterConfig = defaultImport.default;
                    testEndpoints(config, options.detail);
                }).catch(console.error);
        }
    )
program.parse()
