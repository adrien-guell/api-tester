#!/usr/bin/env node
import {ApiConfig} from "./src/ApiConfig";
import chalk from "chalk";
import axios from "axios";
export * from "./src/ApiConfig";

// TODO find automaticaly the js file folder
import(`${process.cwd()}\\lib\\apitester-config.js`).then((defaultImport) => {
    const config: ApiConfig = defaultImport.default;
    console.log(JSON.stringify(config));
    for (const endpoint of config.endpoints) {
        axios.get(`${config.baseUrl}${endpoint.route}`)
            .then((response) => {
                try {
                    console.log(response.data);
                    endpoint.decoder(response.data);
                    console.log(chalk.green(`Decoded successfully: ${endpoint.route}`));
                } catch (e) {
                    console.log(chalk.red(`Decoding error: ${endpoint.route}`))
                }
            })
            .catch(console.error)
    }
});
