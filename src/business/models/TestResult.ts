import { AxiosError, AxiosResponse, Method } from 'axios';

export type ResultStatus = 'requestError' | 'decodeError' | 'postRequestError' | 'success';

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
    | DecodeErrorData
    | PostRequestErrorData<T>
    | SuccessData<T>;

export type RequestErrorData = {
    status: 'requestError';
    error: AxiosError;
};

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

export function complementaryDataIsRequestErrorData<T>(
    complementaryData: ComplementaryData<T>
): complementaryData is RequestErrorData {
    return complementaryData.status == 'requestError';
}

export function complementaryDataIsDecodeErrorData<T>(
    complementaryData: ComplementaryData<T>
): complementaryData is DecodeErrorData {
    return complementaryData.status == 'decodeError';
}

export function complementaryDataIsPostRequestErrorData<T>(
    complementaryData: ComplementaryData<T>
): complementaryData is PostRequestErrorData<T> {
    return complementaryData.status == 'postRequestError';
}

export function complementaryDataIsSuccessData<T>(
    complementaryData: ComplementaryData<T>
): complementaryData is SuccessData<T> {
    return complementaryData.status == 'success';
}
