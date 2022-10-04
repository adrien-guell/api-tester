#!/usr/bin/env node
import {ApiConfig} from "./ApiConfig";

import(`${process.cwd()}\\config.ts`).then((config: ApiConfig) => {
    console.log(config);
})
