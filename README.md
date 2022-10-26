# ApiTester

The goal of this package is to test your project's decoders with their corresponding api.

We recommend using the [typescript-json-decoder](https://www.npmjs.com/package/typescript-json-decoder)
package which provides detailed error messages.

# Features and specifications

- The tested decoders must throw an error if it cannot decode a json.
- A CLI is provided to use run the tests.
- A report can be generated as an html file using the -r option.
- A complete log of the tests is generated after each execution.
- The process will always return 1 if one or more test failed.
- This package uses Axios to run the Http requests.

## Setup

Instalation : `npm i decoder-api-tester`

___

Create the apitester-config.ts file in the root of your project.

A configuration contains a list of API configuration which contains a list of endpoint configuration.

```typescript
import { ApiTesterConfig } from "api-tester";
import { firstDecoder, secondDecoder } from "src/decoders";
import { getAccessToken, isWantedFormat } from "src/utils";

const config: ApiTesterConfig = {
    apisConfig: [
        {
            baseUrl: "https://my-api.com/",
            method: "post",
            decoder: firstDecoder,
            preRequestAction: (axiosConfig: AxiosRequestConfig) => {
                axiosConfig.headers["AccessToken"] = getAccessToken();
                return axiosConfig;
            },
            postRequestValidation: (data: Data) => {
                if (!isWantedFormat(data.formatedString)) {
                    throw 'formatedString is not on the right format';
                }
            },
            queryParameters: {
                apiKey: "my-api-key"
            },
            headers: {
                "Connection": "Keep-Alive"
            },
            data: {
                foo: "bar"
            },
            endpoints: [
                // This endpoint will use the config of the api
                {
                    description: "Post data",
                    route: "data/post",
                },
                // Here all the config will overwrite the ones of the api
                {
                    description: "Get random data",
                    route: "data/random",
                    method: "get",
                    decoder: secondDecoder,
                    preRequestAction: (axiosConfig: AxiosRequestConfig) => {
                        return axiosConfig;
                    },
                    postRequestValidation: (data: Data) => {
                    },
                    queryParameters: {
                        limit: false
                    },
                    headers: {},
                    data: {},
                },
            ],
        }
    ]
};

export default config;
```

___

Run the command `api-tester`
> Type `api-tester -h` to show command manual.

# Config parameters

## Common parameters

The endpoint config is used first, if a field is not specified, then the api config will be used.

| Attribute               | Type                                                                                                                                                     | Description                                                                                                     |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `method`                | <code>'get' &vert; 'delete' &vert; 'head' &vert; 'options' &vert; 'post' &vert; 'put' &vert; 'patch' &vert; 'purge' &vert; 'link' &vert; 'unlink'</code> | http rest method                                                                                                |
| `decoder`               | <code>(input: unknown) => T</code>                                                                                                                       | decoder function                                                                                                |
| `preRequestAction`      | <code>(axiosConfig: AxiosRequestConfig) => AxiosRequestConfig</code>                                                                                     | function called after the axios config object is generated, it must return axiosConfig                          |
| `postRequestValidation` | <code>(data: T, json: any) => void</code>                                                                                                                | function called after decoder, it must throw an error if the decoded data or the received raw json is not valid |
| `queryParameters`       | <code>Dict<string[] &vert; string &vert; number &vert; boolean></code>                                                                                   | query parameters of the request                                                                                 |
| `headers`               | <code>Dict<string &vert; number &vert; boolean></code>                                                                                                   | headers of the request                                                                                          |
| `data`                  | <code>any</code>                                                                                                                                         | data stored in the body of the request                                                                          |


## Api

| Attribute               | Type                                                                                                                                                     | Description                                                                                                     |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `baseUrl`               | <code>string</code>                                                                                                                                      | base url of the api                                                                                             |
| `endpoints`             | <code>[Endpoint](#Endpoint)<T>[]</code>                                                                                                                  | endpoints configuration                                                                                         |

## Endpoint

| Attribute               | Type                                                                                                                                                     | Description                                |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| `description`           | <code>string</code>                                                                                                                                      | name or description of the tested endpoint |
| `route`                 | <code>string</code>                                                                                                                                      | route to the endpoint                      |

















