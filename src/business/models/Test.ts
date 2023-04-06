import { BeforeDecode, Interceptor, OnDecoded } from "./Interceptor";
import { DecoderFunction } from "typescript-json-decoder";
import { Method } from "axios";
import Dict = NodeJS.Dict;

export type Test<Data> = {
    name?: string;
    endpointPath: string;
    beforeDecode?: BeforeDecode;
    decoder?: DecoderFunction<Data>;
    onDecoded?: OnDecoded<Data>;

    method?: Method;
    interceptor?: Interceptor;
    queryParameters?: Dict<string[] | string | number | boolean>;
    headers?: Record<string, string | number | boolean>;
    data?: any;
}
