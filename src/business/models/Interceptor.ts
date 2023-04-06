import { AxiosRequestConfig } from "axios";

export type Interceptor = (axiosConfig: AxiosRequestConfig, context: any) => Promise<AxiosRequestConfig> | AxiosRequestConfig;

export type OnDecoded<Data> = (data: Data, json: any, setContext: (context: any) => void) => Promise<void> | void;

export type BeforeDecode = (json: any) => Promise<void> | void;