import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { promptApiThatIsTested } from './ui/uiTools';
import { ApiTesterConfig } from './models/ApiTesterConfig';
import { readFileSync } from 'fs';
import path from 'path';
import { TestResult } from './models/TestResult';
import { Api } from './models/Api';
import { Endpoint } from './models/Endpoint';

async function testEndpoint(api: Api, endpoint: Endpoint<any>, showDetails: boolean): Promise<TestResult> {
    let axiosRequestConfig: AxiosRequestConfig = {
        baseURL: api.baseUrl,
        url: endpoint.route,
        method: endpoint.method,
        headers: api.headers,
        params: Object.assign({}, api.queryParameters, endpoint.queryParameters),
        data: endpoint.body,
    };

    if (endpoint.preRequestAction) axiosRequestConfig = endpoint.preRequestAction(axiosRequestConfig);

    return axios
        .request(axiosRequestConfig)
        .then((response) => {
            try {
                if (endpoint.decoder) {
                    const decodedData = endpoint.decoder(response.data);
                    try {
                        if (endpoint.postRequestValidation)
                            endpoint.postRequestValidation(decodedData, response.data);
                        return {
                            status: 'decodeError',
                                route: endpoint.route,
                            decoderName: endpoint.decoder?.name,
                            timestamp: Date.now(),
                            error: error,
                        };
                    } catch (error) {
                        return {
                            status: 'postRequestError',
                            route: endpoint.route,
                            decoderName: endpoint.decoder.name,
                            decodedData: decodedData,
                            timestamp: Date.now(),
                            error: error,
                        };
                    }
                }
                return {
                    status: 'decodeError',
                    route: endpoint.route,
                    decoderName: endpoint.decoder?.name,
                    timestamp: Date.now(),
                    error: error,
                };
            } catch (error) {
                return {
                    status: 'decodeError',
                    route: endpoint.description ?? endpoint.route,
                    decoderName: endpoint.decoder?.name,
                    timestamp: Date.now(),
                    error: error,
                };
            }
        })
        .catch((error: Error | AxiosError) => {
            return {
                status: 'requestError',
                route: endpoint.description ?? endpoint.route,
                decoderName: endpoint.decoder?.name,
                timestamp: Date.now(),
                error: error,
            };
        });
}

export async function testEndpoints(config: ApiTesterConfig, showDetails: boolean) {
    const testResults: TestResult[] = [];
    for (const api of config.apisConfig) {
        for (const endpoint of api.endpoints) {
            const testResult = await testEndpoint(api, endpoint, showDetails);
            testResults.push(testResult);
        }
    }
    return testResults;
}

export function getConfigLocation() {
    let currentWorkingDirectory = process.cwd();
    const basefile: string = './tsconfig.json';
    while (!fs.existsSync(basefile)) {
        currentWorkingDirectory = path.join(currentWorkingDirectory, '../');
    }
    let file: string = readFileSync(`${currentWorkingDirectory}\\tsconfig.json`, 'utf8');
    file = file.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
    const outDir = JSON.parse(file).compilerOptions.outDir ?? '';
    return path.join(currentWorkingDirectory, outDir, 'apitester-config.js');
}
