#!/usr/bin/env node
import {Api} from "./src/models/Api";
import {testEndpoints} from "./src/endpointTest";
export * from "./src/models/ApiTesterConfig";

// TODO find automaticaly the js file folder
import(`${process.cwd()}\\lib\\apitester-config.js`).then((defaultImport) => {
    const config: Api = defaultImport.default;
    testEndpoints(config);
});
