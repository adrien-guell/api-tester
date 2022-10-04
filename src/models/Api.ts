import {Endpoint} from "./Endpoint";
import {ApiKey} from "./ApiKey";

export type Api = {
    baseUrl: string,
    endpoints: Endpoint<any>[],
    headers?: { [key: string]: string | number },
    apiKey?: ApiKey
}
