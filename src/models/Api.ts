import { Endpoint } from './Endpoint';
import Dict = NodeJS.Dict;

export type Api = {
    baseUrl: string;
    endpoints: Endpoint<any>[];
    headers?: Record<string, string | number | boolean>;
    queryParameters?: Dict<string[] | string | number | boolean>;
    body?:any
};
