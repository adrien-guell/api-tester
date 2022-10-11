import axios, { AxiosError } from 'axios';
import { promptApiThatIsTested, promptFail } from './ui/uiTools';
import { ApiTesterConfig } from './models/ApiTesterConfig';
import chalk from 'chalk';
import * as fs from 'fs';
import {readFileSync} from "fs";
import path from "path";

export async function testEndpoints(config: ApiTesterConfig, showDetails: boolean) {
    if (!fs.existsSync('apitester_logs')) fs.mkdirSync('apitester_logs');
    const logFilename = `apitester_logs\\apitester-log-${Date.now()}.txt`;

    for (const api of config.apisConfig) {
        promptApiThatIsTested(api.baseUrl);
        for (const endpoint of api.endpoints) {
            await axios
                .get(`${api.baseUrl}${endpoint.route}`, {
                    headers: api.headers,
                    params: Object.assign({}, api.apiKey, endpoint.queryParameters),
                })
                .then((response) => {
                    try {
                        const decodedData = endpoint.decoder(response.data);
                        if (endpoint.postRequestValidation)
                            endpoint.postRequestValidation(decodedData, response.data);
                        console.log(chalk.green(`${endpoint.route} - Success`));
                    } catch (error) {
                        promptFail(endpoint.route, showDetails, logFilename, error);
                    }
                })
                .catch((error: Error | AxiosError) => {
                    promptFail(endpoint.route, showDetails, logFilename, error);
                });
        }
    }
}

export function getConfigLocation() {
    const currentWorkingDirectory = process.cwd();
    let file: string = readFileSync(`${currentWorkingDirectory}\\tsconfig.json`, 'utf8');
    file = file.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
    const outDir = JSON.parse(file).compilerOptions.outDir ?? '';
    return path.join(currentWorkingDirectory, outDir, 'apitester-config.js');
}
