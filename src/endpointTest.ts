import axios, { AxiosError } from 'axios';
import { promptApiThatIsTested, promptFail } from './ui/uiTools';
import { ApiTesterConfig } from './models/ApiTesterConfig';
import chalk from 'chalk';
import * as fs from 'fs';

export async function testEndpoints(config: ApiTesterConfig, showDetails: boolean) {
    if (!fs.existsSync('apitester_logs')) fs.mkdirSync('apitester_logs');
    const logFilename = `apitester_logs\\apitester-log-${Date.now()}.txt`;

    for (const api of config.apisConfig) {
        promptApiThatIsTested(api.baseUrl);
        for (const endpoint of api.endpoints) {
            await axios
                .get(`${api.baseUrl}${endpoint.route}`, {
                    headers: api.headers,
                    params: Object.assign({}, api.apiKey, endpoint.queryParameters),
                })
                .then((response) => {
                    try {
                        const decodedData = endpoint.decoder(response.data);
                        if (endpoint.postRequestValidation)
                            endpoint.postRequestValidation(decodedData);
                        console.log(chalk.green(`${endpoint.route} - Success`));
                    } catch (error) {
                        promptFail(endpoint.route, showDetails, logFilename, error);
                    }
                })
                .catch((error: Error | AxiosError) => {
                    promptFail(endpoint.route, showDetails, logFilename, error);
                });
        }
    }
}
