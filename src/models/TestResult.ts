import { AxiosError, AxiosResponse } from 'axios';

export type TestResult = {
    status: 'requestError' | 'decodeError' | 'postRequestError' | 'success';
    route?: string;
    decoderName?: string;
    timestamp: number;
    complementaryData: ComplementaryData;
};

export type ComplementaryData =
    | RequestErrorData
    | DecodeErrorData
    | PostRequestErrorData
    | SuccessData;

export type RequestErrorData = {
    status: 'requestError';
    error: AxiosError;
};

export type DecodeErrorData = {
    status: 'decodeError';
    error: any;
};

export type PostRequestErrorData = {
    status: 'postRequestError';
    decodedData: any;
    error: any;
};

export type SuccessData = {
    status: 'success';
    decodedData?: any;
    axiosResponse: AxiosResponse;
};

export function complementaryDataIsSuccessData(complementaryData: ComplementaryData): complementaryData is SuccessData {
    return complementaryData.status == 'success';
}
