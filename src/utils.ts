import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { promptApiThatIsTested, promptFail } from './ui/uiTools';
import { ApiTesterConfig } from './models/ApiTesterConfig';
import chalk from 'chalk';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import path from 'path';
import { Api } from './models/Api';
import { Endpoint } from './models/Endpoint';


async function testEndpoint(api: Api, endpoint: Endpoint<any>, showDetails: boolean) {
    const logFilename = `apitester_logs\\apitester-log-${Date.now()}.txt`;

    let axiosRequestConfig: AxiosRequestConfig = {
        baseURL: api.baseUrl,
        url: endpoint.route,
        method: endpoint.method,
        headers: api.headers,
        params: Object.assign({}, api.queryParameters, endpoint.queryParameters),
        data: endpoint.body
    };

    if (endpoint.preRequestAction)
        axiosRequestConfig = endpoint.preRequestAction(axiosRequestConfig);

    await axios
        .request(axiosRequestConfig)
        .then((response) => {
            try {
                if (endpoint.decoder) {
                    const decodedData = endpoint.decoder(response.data);
                    if (endpoint.postRequestValidation)
                        endpoint.postRequestValidation(decodedData, response.data);
                }
                console.log(chalk.green(`${endpoint.route} - Success`));
            } catch (error) {
                promptFail(endpoint.description??endpoint.route, showDetails, logFilename, error);
            }
        })
        .catch((error: Error | AxiosError) => {
            promptFail(endpoint.description??endpoint.route, showDetails, logFilename, error);
        });

    return axiosRequestConfig;
}

export async function testEndpoints(config: ApiTesterConfig, showDetails: boolean) {
    if (!fs.existsSync('apitester_logs')) fs.mkdirSync('apitester_logs');

    for (const api of config.apisConfig) {
        promptApiThatIsTested(api.baseUrl);

        for (const endpoint of api.endpoints) {
            testEndpoint(api, endpoint, showDetails);
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
