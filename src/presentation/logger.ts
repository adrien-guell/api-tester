import * as fs from 'fs';
import * as config from '../../config.json';
import { getMostRecentFilename } from '../utils';
import {
    complementaryDataIsDecodeErrorData, complementaryDataIsPostRequestErrorData,
    complementaryDataIsRequestErrorData, complementaryDataIsSuccessData,
    ResultStatus,
    TestResult,
} from '../business/models/TestResult';
import dateFormat from 'dateformat';

export function getLogPath(): string {
    let logPath = `${config.logDirectory}\\${config.logFilename}${Date.now()}.txt`;
    if (!fs.existsSync(config.logDirectory)) {
        fs.mkdirSync(config.logDirectory);
    } else {
        const mostRecentLogPath = getMostRecentFilename(config.logDirectory);
        if (fs.statSync(mostRecentLogPath).size < config.logMaxSize) {
            logPath = mostRecentLogPath;
        }
    }
    return logPath;
}

const resultStatusMap: Record<ResultStatus, { title: string, description: string }> = {
    'requestError': {
        title: 'ERROR: REQUEST',
        description: 'An error occurred while sending the request',
    },
    'decodeError': {
        title: 'ERROR: DECODE',
        description: 'An error occurred while decoding the received data',
    },
    'postRequestError': {
        title: 'ERROR: POST-REQUEST',
        description: 'An error occurred while executing the post-request validation function',
    },
    'success': {
        title: 'SUCCESS',
        description: 'Test finished successfully',
    },
};

export function generateLogsDataFromTestResults<T>(testResults: TestResult<T>[]): LogData[] {
    return testResults.map((testResult: TestResult<T>) => {
        const dateTime = dateFormat(new Date(testResult.timestamp), config.dateFormat);
        const title = resultStatusMap[testResult.status].title;
        const description = resultStatusMap[testResult.status].description;

        const complementaryData = testResult.complementaryData;
        let complementaryBody: any;
        if (complementaryDataIsRequestErrorData(complementaryData)) {
            complementaryBody = {
                error: complementaryData.error.message,
                stacktrace: complementaryData.error.stack,
            };
        } else if (complementaryDataIsDecodeErrorData(complementaryData)) {
            complementaryBody = complementaryData.error instanceof Error ?
                 {
                    error: complementaryData.error.message,
                    stacktrace: complementaryData.error.stack
                } : {
                    error: complementaryData.error,
                    stacktrace: 'Cannot retrieve stacktrace'
                }
        } else if (complementaryDataIsPostRequestErrorData(complementaryData)) {
            complementaryBody = complementaryData.error instanceof Error ?
                {
                    error: complementaryData.error.message,
                    stacktrace: complementaryData.error.stack,
                    decodedData: JSON.stringify(complementaryData.decodedData, null, 2)
                } : {
                    error: complementaryData.error,
                    stacktrace: 'Cannot retrieve stacktrace',
                    decodedData: JSON.stringify(complementaryData.decodedData, null, 2)
                }
        } else if (complementaryDataIsSuccessData(complementaryData)) {
            complementaryBody = {
                decodedData: JSON.stringify(complementaryData.decodedData, null, 2),
                axiosResponse: JSON.stringify(complementaryData.axiosResponse, null, 2)
            };
        }

        const body = {
            description: testResult.description ?? 'No description given',
            baseUrl: testResult.baseUrl,
            route: testResult.route,
            method: testResult.method,
            decoderName: testResult.decoderName ?? 'No decoder given',
            ...complementaryBody,
        };

        return {
            dateTime: dateTime,
            title: title,
            resultDescription: description,
            body: body,
        } as LogData;
    });
}

export function writeLog(logsData: LogData[], logPath: string) {

}

export type LogData = {
    dateTime: string;
    title: string;
    resultDescription: string;
    body: any;
}


/**
 *
 * 01/03/2022 08:51:01.562 SUCCESS            : Test finished successfully
 *                                              description: my descritpion
 *                                              route: api/route
 *                                              decoder: myDecoder
 *                                              decodedData: {
 *                                                  truc: "tata",
 *                                                  machin: "toto"
 *                                              }
 *                                              axiosResponse: {
 *                                                  ...........
 *                                              }
 * 01/03/2022 08:51:01.562 ERROR: REQUEST     : Error during request
 *                                              description: my descritpion
 *                                              route: api/route
 *                                              error: a text with the error
 *                                              stacktrace: {
 *                                                  ...........
 *                                              }
 * 01/03/2022 08:51:01.562 ERROR: DECODE      : Error during decoding
 *                                              description: my descritpion
 *                                              route: api/route
 *                                              decoder: myDecoder
 *                                              error: a text with the error
 *                                              stacktrace: {
 *                                                ...........
 *                                              }
 * 01/03/2022 08:51:01.562 ERROR: POST-REQUEST: Error during post-request validation
 *                                              description: my descritpion
 *                                              route: api/route
 *                                              decoder: myDecoder
 *                                              decodedData: {
 *                                                  truc: "tata",
 *                                                  machin: "toto"
 *                                              }
 *                                              error: a text with the error
 *                                              stacktrace: {
 *                                                  ...........
 *                                              }
 *
 */