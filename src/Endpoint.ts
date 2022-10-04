import {Pojo} from "typescript-json-decoder";


export type Endpoint = {
    route: string,
    decoder: (pojo: Pojo) => unknown
}
