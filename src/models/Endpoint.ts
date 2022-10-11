import { DecoderFunction } from "typescript-json-decoder";
import { Dict } from "./Dict";

export type Endpoint<T> = {
    route: string,
    decoder: DecoderFunction<T>,
    postRequestValidation?: (data: T, json: T) => void,
    queryParameters?: Dict
}
