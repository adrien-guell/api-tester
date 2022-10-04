#!/usr/bin/env node
import {ApiConfig} from "./src/models/ApiConfig";
import {testEndpoints} from "./src/endpointTest";
export * from "./src/models/ApiTesterConfig";

// TODO find automaticaly the js file folder
import(`${process.cwd()}\\lib\\apitester-config.js`).then((defaultImport) => {
    const config: ApiConfig = defaultImport.default;
    testEndpoints(config);
});
