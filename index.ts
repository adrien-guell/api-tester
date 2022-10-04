#!/usr/bin/env node
import {testEndpoints} from "./src/endpointTest";
import {ApiTesterConfig} from "./src/models/ApiTesterConfig";
export * from "./src/models/ApiTesterConfig";

// TODO find automaticaly the js file folder
import(`${process.cwd()}\\lib\\apitester-config.js`).then((defaultImport) => {
    const config: ApiTesterConfig = defaultImport.default;
    testEndpoints(config);
});
