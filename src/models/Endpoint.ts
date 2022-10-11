import { DecoderFunction } from "typescript-json-decoder";
import Dict = NodeJS.Dict;

export type Endpoint<T> = {
    route: string,
    decoder: DecoderFunction<T>,
    postRequestValidation?: (data: T, json: any) => void,
    queryParameters?: Dict<string[] | string | number | boolean>
}
