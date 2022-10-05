import axios, {AxiosError} from "axios";
import {promptApiThatIsTested, promptErrorDecoding, promptSuccessDecoding} from "./ui/uiTools";
import {ApiTesterConfig} from "./models/ApiTesterConfig";
import {writeFileSync} from "fs";

export async function testEndpoints(config: ApiTesterConfig, showDetails: boolean) {
    const logFilename = `apitester-log-${Date.now()}.txt`
    for (const api of config.apisConfig) {
        promptApiThatIsTested(api.baseUrl);
        for (const endpoint of api.endpoints) {
            await axios.get(
                `${api.baseUrl}${endpoint.route}`,
                {
                    headers: api.headers,
                    params: Object.assign({}, api.apiKey, endpoint.queryParameters)
                }
            ).then((response) => {
                try {
                    const decodedData = endpoint.decoder(response.data);
                    if (endpoint.postRequestValidation) endpoint.postRequestValidation(decodedData);
                    promptSuccessDecoding(endpoint.route);
                } catch (e) {
                    promptErrorDecoding(endpoint.route);
                    if (showDetails)
                        console.error(e);
                    writeFileSync(logFilename, `${e}`);
                }
            }).catch((error: Error | AxiosError) => {
                console.error(axios.isAxiosError(error) ? error.message : error)
            });
        }
    }
}
