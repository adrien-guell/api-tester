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

A configuration contains a list of API configuration which contains a list of test configuration.

```typescript
import { ApiTesterConfig } from "api-tester";
import { firstDecoder, secondDecoder } from "src/decoders";
import { getAccessToken, isWantedFormat } from "src/utils";

const config: ApiTesterConfig = {
    apisConfig: [
        {
            baseUrl: "https://my-api.com/",
            defaultMethod: "post",
            defaultinterceptor: (axiosConfig: AxiosRequestConfig, context: any) => {
                axiosConfig.headers["AccessToken"] = getAccessToken();
                axiosConfig.params = { id: context.myId }
                return axiosConfig;
            },
            defaultBeforeDecode: (json: unknown) => {
                if (json.code == 404) {
                    throw 'Error 404';
                }
            },
            defaultOnDecoded: (data: Data, json: any, setContext: (context: any) => void) => {
                if (!isWantedFormat(data.formatedString)) {
                    throw 'formatedString is not on the right format';
                }
                setContext({ myId: data.array[0].id })
            },
            defaultQueryParameters: {
                apiKey: "my-api-key"
            },
            defaultHeaders: {
                "Connection": "Keep-Alive"
            },
            defaultData: {
                foo: "bar"
            },
            tests: [
                // This test will use the default options 
                {
                    description: "Post data",
                    endpointPath: "data/post",
                    decoder: firstDecoder
                },
                {
                    description: "Get random data",
                    endpointPath: "data/random",
                    method: "get",
                    decoder: secondDecoder,
                    interceptor: (axiosConfig: AxiosRequestConfig) => {
                        return axiosConfig;
                    },
                    beforeDecode: (json: unknown) => {
                        if (json.code == 404) {
                            throw 'Error 404';
                        }
                    },
                    onDecoded: (data: Data) => {
                        if (!isWantedFormat(data.formatedString)) {
                            throw 'formatedString is not on the right format';
                        }
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

The default options set in the api will be used if none are set in a test.
Both the default functions and the functions will run if they are set.

| Attribute         | Type                                                                                                                                                     | Description                                                                                                     |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `method`          | <code>'get' &vert; 'delete' &vert; 'head' &vert; 'options' &vert; 'post' &vert; 'put' &vert; 'patch' &vert; 'purge' &vert; 'link' &vert; 'unlink'</code> | http rest method                                                                                                |
| `decoder`         | <code>(input: unknown) => T</code>                                                                                                                       | decoder function                                                                                                |
| `interceptor`     | <code>(axiosConfig: AxiosRequestConfig, contest: any) => AxiosRequestConfig</code>                                                                       | function called after the axios config object is generated, it must return axiosConfig                          |
| `beforeDecode`    | <code>(json: any) => void</code>                                                                                                                         | function called after the axios config object is generated, it must return axiosConfig                          |
| `onDecoded`       | <code>(data: T, json: any, setContext: (context: any) => void) => void</code>                                                                            | function called after decoder, it must throw an error if the decoded data or the received raw json is not valid |
| `queryParameters` | <code>Dict<string[] &vert; string &vert; number &vert; boolean></code>                                                                                   | query parameters of the request                                                                                 |
| `headers`         | <code>Dict<string &vert; number &vert; boolean></code>                                                                                                   | headers of the request                                                                                          |
| `data`            | <code>any</code>                                                                                                                                         | data stored in the body of the request                                                                          |


## Api

| Attribute | Type                            | Description         |
|-----------|---------------------------------|---------------------|
| `baseUrl` | <code>string</code>             | base url of the api |
| `tests`   | <code>[Test](#Test)<T>[]</code> | tests configuration |

## Test

| Attribute      | Type                                                                                                                                                     | Description                           |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| `description`  | <code>string</code>                                                                                                                                      | name or description of the test |
| `endpointPath` | <code>string</code>                                                                                                                                      | route to the endpoint                 |

















