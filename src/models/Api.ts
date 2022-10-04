import {Endpoint} from "./Endpoint";
import {Dict} from "./Dict";

export type Api = {
    baseUrl: string,
    endpoints: Endpoint<any>[],
    headers?: Dict,
    apiKey?: Dict
}
