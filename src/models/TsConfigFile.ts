import {DecoderFunction, decodeType, string} from "typescript-json-decoder";
import { Dict } from "./Dict";

export type TsConfigFile = decodeType<typeof tsConfigFileDecoder> ;

export const tsConfigFileDecoder= {
    "compilerOptions": {
        "outDir": string,
    }
}
