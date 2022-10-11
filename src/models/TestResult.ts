import { AxiosError, AxiosResponse } from 'axios';

export type TestResult =
    | TestResultSuccess
    | TestResultDecodeError
    | TestResultRequestError
    | TestResultPostRequestError;

export type TestResultRequestError = {
    status: 'requestError';
    route?: string;
    decoderName?: string;
    timestamp: number;
    error: AxiosError;
};

export type TestResultDecodeError = {
    status: 'decodeError';
    route?: string;
    decoderName?: string;
    timestamp: number;
    error: any;
};

export type TestResultPostRequestError = {
    status: 'postRequestError';
    route?: string;
    decoderName?: string;
    decodedData: any;
    timestamp: number;
    error: any;
};

export type TestResultSuccess = {
    status: 'success';
    route?: string;
    decoderName?: string;
    decodedData: any;
    timestamp: number;
    axiosResponse: AxiosResponse;
};
