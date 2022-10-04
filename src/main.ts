#!/usr/bin/env node
import {ApiConfig} from "./ApiConfig";

import(`${process.cwd()}\\apitester-config.ts`).then((config: ApiConfig) => {
    console.log(config);
});
