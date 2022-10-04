import {DecoderFunction, Pojo} from "typescript-json-decoder";


export type Endpoint<T> = {
    route: string,
    decoder: DecoderFunction<T>,
    postRequestValidation?: (data: T) => void
}
