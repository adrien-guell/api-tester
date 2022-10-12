import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiTesterConfig } from './models/ApiTesterConfig';
import {
    ComplementaryData,
    TestResult,
    complementaryDataIsSuccessData,
} from './models/TestResult';
import { Api } from './models/Api';
import { Endpoint } from './models/Endpoint';
import { DecoderFunction } from 'typescript-json-decoder';
import { stringify } from '../utils';

function testPostRequestValidation<T>(
    postRequestValidation: (data: T, json: any) => void,
    decodedData: T,
    response: AxiosResponse,
): ComplementaryData<T> {
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

function testDecoder<T>(decoder: DecoderFunction<T>, response: AxiosResponse): ComplementaryData<T> {
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

function testResponse<T>(endpoint: Endpoint<any>, response: AxiosResponse): ComplementaryData<T> {
    if (endpoint.decoder) {
        const testDecoderResult = testDecoder(endpoint.decoder, response);
        if (!complementaryDataIsSuccessData(testDecoderResult)) {
            return testDecoderResult;
        }

        if (endpoint.postRequestValidation) {
            return testPostRequestValidation(
                endpoint.postRequestValidation,
                testDecoderResult.decodedData,
                response,
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

async function testEndpoint<T>(api: Api, endpoint: Endpoint<any>): Promise<TestResult<T>> {
    let axiosRequestConfig: AxiosRequestConfig = {
        baseURL: api.baseUrl,
        url: endpoint.route,
        method: endpoint.method ?? api.method,
        headers: Object.assign({}, api.headers, endpoint.headers),
        params: Object.assign({}, api.queryParameters, endpoint.queryParameters),
        data: endpoint.data ?? api.data
    };

    if (endpoint.preRequestAction)
        axiosRequestConfig = endpoint.preRequestAction(axiosRequestConfig);

    return axios
        .request(axiosRequestConfig)
        .then((response) => {
            const complementaryData = testResponse(endpoint, response);
            return {
                description: endpoint.description,
                baseUrl: axiosRequestConfig.baseURL,
                route: axiosRequestConfig.url,
                method: axiosRequestConfig.method,
                decoderName: endpoint.decoder?.name,
                timestamp: Date.now(),
                complementaryData: complementaryData,
            } as TestResult<T>;
        })
        .catch((error: AxiosError) => {
            return {
                description: endpoint.description,
                baseUrl: axiosRequestConfig.baseURL,
                route: axiosRequestConfig.url,
                method: axiosRequestConfig.method,
                decoderName: endpoint.decoder?.name,
                timestamp: Date.now(),
                complementaryData: {
                    status: 'requestError',
                    error: error,
                },
            } as TestResult<T>;
        });
}

export async function testEndpoints(config: ApiTesterConfig): Promise<TestResult<any>[]> {
    const testResults: TestResult<any>[] = [];
    for (const api of config.apisConfig) {
        for (const endpoint of api.endpoints) {
            const testResult = await testEndpoint(api, endpoint);
            testResults.push(testResult);
        }
    }
    return testResults;
}