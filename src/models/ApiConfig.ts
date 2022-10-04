import {Endpoint} from "./Endpoint";

export type ApiConfig = {
    baseUrl: string,
    endpoints: Endpoint<any>[],
    headers?: { [key: string]: string | number }
}
