#!/usr/bin/env node
import {ApiConfig} from "./ApiConfig";
import chalk from "chalk";
import axios from "axios";

const i = `./apitester-config`;
import(i).then((config: ApiConfig) => {
    for (const endpoint of config.endpoints) {
        axios.get(`${config.baseUrl}${endpoint.route}`)
            .then((response) => {
                try {
                    endpoint.decoder(response.data);
                    console.log(chalk.green(`Decoded successfully: ${endpoint.route}`));
                } catch (e) {
                    console.log(chalk.red(`Decoding error: ${endpoint.route}`))
                }
            })
            .catch(console.error)
    }
});
