import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiTesterConfig } from './models/ApiTesterConfig';
import { readFileSync } from 'fs';
import path from 'path';
import {
    ComplementaryData,
    TestResult,
    complementaryDataIsSuccessData,
} from './models/TestResult';
import { Api } from './models/Api';
import { Endpoint } from './models/Endpoint';
import { DecoderFunction } from 'typescript-json-decoder';

function testPostRequestValidation<T>(
    postRequestValidation: (data: T, json: any) => void,
    decodedData: T,
    response: AxiosResponse
): ComplementaryData {
    try {
        postRequestValidation(decodedData, response.data);
        return {
            status: 'success',
            axiosResponse: response,
        };
    } catch (error: any) {
        return {
            status: 'postRequestError',
            decodedData: decodedData,
            error: error,
        };
    }
}

function testDecoder<T>(decoder: DecoderFunction<T>, response: AxiosResponse): ComplementaryData {
    try {
        const decodedData = decoder(response.data);
        return {
            status: 'success',
            decodedData: decodedData,
            axiosResponse: response,
        };
    } catch (error: any) {
        return {
            status: 'decodeError',
            error: error,
        };
    }
}

function testResponse(endpoint: Endpoint<any>, response: AxiosResponse): ComplementaryData {
    if (endpoint.decoder) {
        const testDecoderResult = testDecoder(endpoint.decoder, response);
        if (!complementaryDataIsSuccessData(testDecoderResult)) {
            return testDecoderResult;
        }

        if (endpoint.postRequestValidation) {
            return testPostRequestValidation(
                endpoint.postRequestValidation,
                testDecoderResult.decodedData,
                response
            );
        }

        return testDecoderResult;
    } else {
        return {
            status: 'success',
            axiosResponse: response,
        };
    }
}

async function testEndpoint(api: Api, endpoint: Endpoint<any>): Promise<TestResult> {
    let axiosRequestConfig: AxiosRequestConfig = {
        baseURL: api.baseUrl,
        url: endpoint.route,
        method: endpoint.method,
        headers: api.headers,
        params: Object.assign({}, api.queryParameters, endpoint.queryParameters),
        data: endpoint.body,
    };

    if (endpoint.preRequestAction)
        axiosRequestConfig = endpoint.preRequestAction(axiosRequestConfig);

    let complementaryData: ComplementaryData;
    return axios
        .request(axiosRequestConfig)
        .then((response) => {
            const complementaryData = testResponse(endpoint, response);
            return {
                route: endpoint.route,
                decoderName: endpoint.decoder?.name,
                timestamp: Date.now(),
                complementaryData: complementaryData
            } as TestResult;
        })
        .catch((error: AxiosError) => {
            return {
                route: endpoint.description ?? endpoint.route,
                decoderName: endpoint.decoder?.name,
                timestamp: Date.now(),
                complementaryData: {
                    status: 'requestError',
                    error: error
                }
            } as TestResult;
        })
}

export async function testEndpoints(config: ApiTesterConfig): Promise<TestResult[]> {
    const testResults: TestResult[] = [];
    for (const api of config.apisConfig) {
        for (const endpoint of api.endpoints) {
            const testResult = await testEndpoint(api, endpoint);
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
