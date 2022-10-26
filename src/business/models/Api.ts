import { AxiosRequestConfig, Method } from 'axios';
import { Endpoint } from './Endpoint';
import Dict = NodeJS.Dict;
import { DecoderFunction } from 'typescript-json-decoder';

export type Api<T = any> = {
    baseUrl: string;
    method?: Method;
    decoder?: DecoderFunction<T>;
    preRequestAction?: (axiosConfig: AxiosRequestConfig) => AxiosRequestConfig;
    postRequestValidation?: (data: T, json: any) => void;
    queryParameters?: Dict<string[] | string | number | boolean>;
    headers?: Record<string, string | number | boolean>;
    data?: any;
    endpoints: Endpoint<T>[];
};
