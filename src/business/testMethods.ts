import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiTesterConfig } from './models/ApiTesterConfig';
import { ComplementaryData, TestResult, complementaryDataIsSuccessData } from './models/TestResult';
import { Api } from './models/Api';
import { Endpoint } from './models/Endpoint';
import { DecoderFunction } from 'typescript-json-decoder';
import { Presets, SingleBar } from 'cli-progress';

function testPostRequestValidation<T>(
    postRequestValidation: (data: T, json: any) => void,
    decodedData: T,
    response: AxiosResponse
): ComplementaryData<T> {
    try {
        postRequestValidation(decodedData, response.data);
        return {
            status: 'success',
            axiosResponse: response,
            decodedData: decodedData,
            rawData: response.data,
        };
    } catch (error: any) {
        return {
            status: 'postRequestError',
            decodedData: decodedData,
            rawData: response.data,
            error: error,
        };
    }
}

function testDecoder<T>(
    decoder: DecoderFunction<T>,
    response: AxiosResponse
): ComplementaryData<T> {
    try {
        const decodedData = decoder(response.data);
        return {
            status: 'success',
            decodedData: decodedData,
            axiosResponse: response,
            rawData: response.data,
        };
    } catch (error: any) {
        return {
            status: 'decodeError',
            error: error,
            rawData: response.data,
        };
    }
}

function testResponse<T>(
    api: Api,
    endpoint: Endpoint<T>,
    response: AxiosResponse
): ComplementaryData<T> {
    if (endpoint.decoder) {
        const testDecoderResult = testDecoder(endpoint.decoder ?? api.decoder, response);
        if (!complementaryDataIsSuccessData(testDecoderResult)) {
            return testDecoderResult;
        }

        if (endpoint.postRequestValidation && testDecoderResult.decodedData) {
            return testPostRequestValidation(
                endpoint.postRequestValidation ?? api.postRequestValidation,
                testDecoderResult.decodedData,
                response
            );
        }
        return testDecoderResult;
    } else {
        return {
            status: 'success',
            axiosResponse: response,
            rawData: response.data,
        };
    }
}

async function testEndpoint<T>(
    api: Api,
    endpoint: Endpoint<T>,
    callback: () => void = () => {}
): Promise<TestResult<T>> {
    let axiosRequestConfig: AxiosRequestConfig = {
        baseURL: api.baseUrl,
        url: endpoint.route,
        method: endpoint.method ?? api.method ?? 'get',
        headers: Object.assign({}, api.headers, endpoint.headers),
        params: Object.assign({}, api.queryParameters, endpoint.queryParameters),
        data: endpoint.data ?? api.data,
    };

    if (endpoint.preRequestAction) {
        axiosRequestConfig = endpoint.preRequestAction(axiosRequestConfig);
    }
    else if (api.preRequestAction) {
        axiosRequestConfig = api.preRequestAction(axiosRequestConfig);
    }

    return axios
        .request(axiosRequestConfig)
        .then((response) => {
            const complementaryData = testResponse(api, endpoint, response);
            callback();
            return {
                description: endpoint.description,
                baseUrl: axiosRequestConfig.baseURL,
                route: axiosRequestConfig.url,
                method: axiosRequestConfig.method,
                timestamp: Date.now(),
                complementaryData: complementaryData,
            } as TestResult<T>;
        })
        .catch((error: AxiosError) => {
            callback();
            return {
                description: endpoint.description,
                baseUrl: axiosRequestConfig.baseURL,
                route: axiosRequestConfig.url,
                method: axiosRequestConfig.method,
                timestamp: Date.now(),
                complementaryData: {
                    status: 'requestError',
                    error: error,
                },
            } as TestResult<T>;
        });
}

export async function testEndpoints<T = any>(config: ApiTesterConfig): Promise<TestResult<T>[]> {
    const testResults: Promise<TestResult<T>>[] = [];
    const bar = new SingleBar(
        { format: `|{bar}| {percentage}% || {value}/{total}` },
        Presets.shades_classic
    );
    bar.start(
        config.apisConfig.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.endpoints.length;
        }, 0),
        0
    );

    config.apisConfig.forEach((api) =>
        api.endpoints.forEach((endpoint) =>
            testResults.push(
                testEndpoint(api, endpoint, () => {
                    bar.increment();
                })
            )
        )
    );
    const results = await Promise.all(testResults);
    bar.stop();
    return results;
}
