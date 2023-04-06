import { Test } from './Test';
import { BeforeDecode, Interceptor, OnDecoded } from "./Interceptor";
import { Method } from "axios";
import Dict = NodeJS.Dict;

export type Api<Data = any> = {
    baseUrl: string;
    tests: Test<any>[];

    defaultMethod?: Method;
    defaultInterceptor?: Interceptor;
    defaultBeforeDecode?: BeforeDecode;
    defaultOnDecoded?: OnDecoded<Data>;
    defaultQueryParameters?: Dict<string[] | string | number | boolean>;
    defaultHeaders?: Record<string, string | number | boolean>;
    defaultData?: any;
};
