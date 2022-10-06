# ApiTester

The goal of this package is to test that your decoders match with the objects returned by a specific https GET request.
This package only works on typescript projects.

## Setup

Instalation : `npm i decoder-api-tester`

___

Create the apitester-config.ts file in the root of your project.

```typescript
import { ApiTesterConfig } from "api-tester";
import { dataDecoder } from "src/decoders/dataDecoder"

const config: ApiTesterConfig = {
    apisConfig: [
        {
            baseUrl: "https://my-api.com/",
            endpoints: [
                {
                    route: "data/random",
                    decoder: dataDecoder,
                    postRequestValidation: (data: Data) => {
                        if (!isWantedFormat(data.formatedString)) throw "formatedString is not on the right format";
                    },
                    queryParameters: {
                        limit: false
                    }
                },
            ],
            apiKey: {
                apiKey: "my-api-key"
            }
        }
    ]
};

export default config;
```

>`postRequestValidation` is optional, it's a function that will be executed on the decoded data. It must throw an error if the decoded data is invalid following your business rules.

___
Add the apitester-config.ts file to the compiled files in tsconfig.json

```json
{
  "compilerOptions": {
    ...
  },
  "include": ["src", "apitester-config.ts"]
}
```
___
Run the command `api-tester`
> Type `api-tester -h` to show command manual.