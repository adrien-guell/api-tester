import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiTesterConfig } from './models/ApiTesterConfig';
import { ComplementaryData, TestResult } from './models/TestResult';
import { Api } from './models/Api';
import { Test } from './models/Test';
import { DecoderFunction } from 'typescript-json-decoder';
import { Presets, SingleBar } from 'cli-progress';
import { Context } from './models/Context';

const context = new Context();

function runOnDecoded<Data>(
    api: Api<Data>,
    test: Test<Data>,
    decodedData: Data,
    response: AxiosResponse,
): ComplementaryData<Data> {
    try {
        api.defaultOnDecoded?.(decodedData, response.data, context.set.bind(context));
        test.onDecoded?.(decodedData, response.data, context.set.bind(context));
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

function runBeforeDecode<Data>(
    api: Api<Data>,
    test: Test<Data>,
    response: AxiosResponse,
): ComplementaryData<Data> | undefined {
    try {
        api.defaultBeforeDecode?.(response.data);
        test.beforeDecode?.(response.data);
    } catch (error) {
        return {
            status: 'beforeDecodeError',
            rawData: response.data,
            error: error,
        };
    }
}

function runDecoder<T>(
    decoder: DecoderFunction<T>,
    response: AxiosResponse,
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
    test: Test<T>,
    response: AxiosResponse,
): ComplementaryData<T> {
    if (test.decoder) {
        let beforeDecodeResult: ComplementaryData<T> | undefined;
        if (test.beforeDecode || api.defaultBeforeDecode) {
            beforeDecodeResult = runBeforeDecode(
                api,
                test,
                response,
            );
        }

        if (beforeDecodeResult) {
            return beforeDecodeResult;
        }

        const testDecoderResult = runDecoder(test.decoder, response);
        if (testDecoderResult.status != 'success') {
            return testDecoderResult;
        }

        if (testDecoderResult.decodedData) {
            return runOnDecoded(
                api,
                test,
                testDecoderResult.decodedData,
                response,
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

async function runTest<T>(
    api: Api,
    test: Test<T>,
    callback: () => void = () => {
    },
): Promise<TestResult<T>> {
    let axiosRequestConfig: AxiosRequestConfig = {
        baseURL: api.baseUrl,
        url: test.endpointPath,
        method: test.method ?? api.defaultMethod ?? 'get',
        headers: { 'Content-Type': 'application/json', ...api.defaultHeaders, ...test.headers },
        params: { ...api.defaultQueryParameters, ...test.queryParameters },
        data: test.data ?? api.defaultData,
    };

    if (api.defaultInterceptor) {
        axiosRequestConfig = await api.defaultInterceptor(axiosRequestConfig, context.get());
    }
    if (test.interceptor) {
        axiosRequestConfig = await test.interceptor(axiosRequestConfig, context.get());
    }

    return axios
        .request(axiosRequestConfig)
        .then((response) => {
            const complementaryData = testResponse(api, test, response);
            callback();
            return {
                description: test.name,
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
                description: test.name,
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

export async function runTests<T = any>(config: ApiTesterConfig): Promise<TestResult<T>[]> {
    const bar = new SingleBar(
        { format: `|{bar}| {percentage}% || {value}/{total}` },
        Presets.shades_classic,
    );

    bar.start(
        config.apisConfig.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.tests.length;
        }, 0),
        0,
    );

    const testResults: (Promise<TestResult<T>> | TestResult<T>)[] = [];

    if (config.parallel) {
        config.apisConfig.forEach((api) =>
            api.tests.forEach((test) =>
                testResults.push(
                    runTest(api, test, () => {
                        bar.increment();
                    }),
                ),
            ),
        );
    } else {
        for (const api of config.apisConfig) {
            for (const test of api.tests) {
                testResults.push(
                    await runTest(api, test, () => {
                        bar.increment();
                    }),
                );
            }
        }
    }

    const results = await Promise.all(testResults);
    bar.stop();
    return results;
}
