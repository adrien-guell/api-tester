#!/usr/bin/env node
import {testEndpoints} from "./src/endpointTest";
import {ApiTesterConfig} from "./src/models/ApiTesterConfig";
import {program} from "commander";
import {readFile} from "fs/promises";
import {TsConfigFile} from "./src/models/TsConfigFile";

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

        async function findOutDir(path: string) {
            const file = await readFile(path, "utf8");
            const r: TsConfigFile = JSON.parse(file)
            return r.compilerOptions.outDir;
        }

        const outDir=(await findOutDir(`${process.cwd()}\\tsconfig.json`));
        import(options.configLocation ? options.configLocation : `${process.cwd()}\\${outDir}\\apitester-config.js`)
            .then((defaultImport) => {
                const config: ApiTesterConfig = defaultImport.default;
                testEndpoints(config, options.detail);
            }).catch(console.error);
    })
program.parse()
