import {Api} from "./models/Api";
import axios from "axios";
import chalk from "chalk";
import {promptErrorDecoding, promptSuccessDecoding} from "./ui/uiTools";

export function testEndpoints(config: Api) {
    for (const endpoint of config.endpoints) {
        axios.get(`${config.baseUrl}${endpoint.route}`, { headers: config.headers })
            .then((response) => {
                try {
                    const decodedData = endpoint.decoder(response.data);
                    if (endpoint.postRequestValidation) {
                        endpoint.postRequestValidation(decodedData);
                    }
                    promptSuccessDecoding(endpoint.route);
                } catch (e) {
                    promptErrorDecoding(endpoint.route)
                }
            })
            .catch(console.error)
    }
}
