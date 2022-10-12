import { Method } from 'axios';
import { Endpoint } from './Endpoint';
import Dict = NodeJS.Dict;

export type Api = {
    baseUrl: string;
    method?: Method;
    endpoints: Endpoint<any>[];
    headers?: Record<string, string | number | boolean>;
    queryParameters?: Dict<string[] | string | number | boolean>;
    body?:any,
    
};
