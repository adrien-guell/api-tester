import { DecoderFunction } from "typescript-json-decoder";
import Dict = NodeJS.Dict;
import {AxiosRequestConfig} from "axios";

export type Endpoint<T> = {
    route: string,
    decoder: DecoderFunction<T>,
    preRequestAction?: (axiosConfig: AxiosRequestConfig) => AxiosRequestConfig,
    postRequestValidation?: (data: T, json: any) => void,
    queryParameters?: Dict<string[] | string | number | boolean>,
    headers?: Record<string, string | number | boolean>;
    body?: any
}
