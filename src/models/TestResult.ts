import { AxiosError, AxiosResponse } from 'axios';

export type TestResult = {
    status: 'requestError' | 'decodeError' | 'postRequestError' | 'success';
    route?: string;
    decoderName?: string;
    timestamp: number;
    special: SpecialData;
};

export type SpecialData =
    | TestResultRequestError
    | TestResultDecodeError
    | TestResultPostRequestError
    | TestResultSuccess;

export type TestResultRequestError = {
    status: 'requestError';
    error: AxiosError;
};

export type TestResultDecodeError = {
    status: 'decodeError';
    error: any;
};

export type TestResultPostRequestError = {
    status: 'postRequestError';
    decodedData: any;
    error: any;
};

export type TestResultSuccess = {
    status: 'success';
    decodedData?: any;
    axiosResponse: AxiosResponse;
};

export function testResultIsSuccess(testResult: SpecialData): testResult is TestResultSuccess {
    return testResult.status == 'success';
}
