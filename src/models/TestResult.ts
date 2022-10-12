import { AxiosError, AxiosResponse } from 'axios';

export type TestResult<T> = {
    status: 'requestError' | 'decodeError' | 'postRequestError' | 'success';
    route?: string;
    decoderName?: string;
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
    error: any;
};

export type PostRequestErrorData<T> = {
    status: 'postRequestError';
    decodedData: T;
    error: any;
};

export type SuccessData<T> = {
    status: 'success';
    decodedData?: T;
    axiosResponse: AxiosResponse;
};

export function complementaryDataIsSuccessData<T>(complementaryData: ComplementaryData<T>): complementaryData is SuccessData<T> {
    return complementaryData.status == 'success';
}
