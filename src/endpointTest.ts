import axios from "axios";
import {promptApiThatIsTested, promptErrorDecoding, promptSuccessDecoding} from "./ui/uiTools";
import {ApiTesterConfig} from "./models/ApiTesterConfig";

export function testEndpoints(config: ApiTesterConfig) {
    for (const api of config.apisConfig) {
        promptApiThatIsTested(api.baseUrl);
        for (const endpoint of api.endpoints) {
            axios.get(
                `${api.baseUrl}${endpoint.route}`,
                {
                    headers: api.headers,
                    params: Object.assign({}, api.apiKey, endpoint.queryParameters)
                }
            ).then((response) => {
                try {
                    const decodedData = endpoint.decoder(response.data);
                    if (endpoint.postRequestValidation) {
                        endpoint.postRequestValidation(decodedData);
                    }
                    promptSuccessDecoding(endpoint.route);
                } catch (e) {
                    promptErrorDecoding(endpoint.route);
                }
            })
                .catch(console.error);
        }
    }
}
