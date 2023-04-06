import { AxiosError, AxiosResponse, Method } from 'axios';

export type ResultStatus = 'requestError' | 'beforeDecodeError' | 'decodeError' | 'postRequestError' | 'success';

export type TestResult<T> = {
    description?: string;
    baseUrl: string;
    route: string;
    method: Method;
    timestamp: number;
    complementaryData: ComplementaryData<T>;
};

export type ComplementaryData<T> =
    | RequestErrorData
    | BeforeDecodeErrorData
    | DecodeErrorData
    | PostRequestErrorData<T>
    | SuccessData<T>;

export type RequestErrorData = {
    status: 'requestError';
    error: AxiosError;
};

export type BeforeDecodeErrorData = {
    status: 'beforeDecodeError';
    rawData: any;
    error: any;
}

export type DecodeErrorData = {
    status: 'decodeError';
    rawData: any;
    error: any;
};

export type PostRequestErrorData<T> = {
    status: 'postRequestError';
    decodedData?: T;
    rawData: any;
    error: any;
};

export type SuccessData<T> = {
    status: 'success';
    decodedData?: T;
    rawData: any;
    axiosResponse: AxiosResponse;
};