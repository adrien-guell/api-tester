import { DecoderFunction } from 'typescript-json-decoder';
import Dict = NodeJS.Dict;
import { AxiosRequestConfig, Method } from 'axios';

export type Endpoint<T> = {
    route: string;
    method?: Method;
    decoder?: DecoderFunction<T>;
    preRequestAction?: (axiosConfig: AxiosRequestConfig) => AxiosRequestConfig;
    postRequestValidation?: (data: T, json: any) => void;
    queryParameters?: Dict<string[] | string | number | boolean>;
    headers?: Record<string, string | number | boolean>;
    body?: any;
    description?: string;
}
