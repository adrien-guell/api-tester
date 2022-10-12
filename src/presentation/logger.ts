import * as fs from 'fs';
import * as config from '../../config.json';
import { getMostRecentFilename, replaceAll, stringify } from '../utils';
import {
    complementaryDataIsDecodeErrorData, complementaryDataIsPostRequestErrorData,
    complementaryDataIsRequestErrorData, complementaryDataIsSuccessData,
    TestResult,
} from '../business/models/TestResult';
import dateFormat from 'dateformat';
import { resultStatusDict } from './string';
import { appendFileSync } from 'fs';

export function getLogPath(): string {
    let logPath = `${config.logDirectory}\\${config.logFilename}${Date.now()}.txt`;
    if (!fs.existsSync(config.logDirectory)) {
        fs.mkdirSync(config.logDirectory);
    } else {
        if (fs.readdirSync(config.logDirectory).length) {
            const mostRecentLogPath = getMostRecentFilename(config.logDirectory);
            if (fs.statSync(mostRecentLogPath).size < config.logMaxSize) {
                logPath = mostRecentLogPath;
            }
        }
    }
    return logPath;
}

export function generateLogsDataFromTestResults<T>(testResults: TestResult<T>[]): LogData[] {
    return testResults.map((testResult: TestResult<T>) => {
        const dateTime = dateFormat(new Date(testResult.timestamp), config.dateFormat);
        const title = resultStatusDict[testResult.complementaryData.status]?.title ?? 'UNKNOWN';
        const description = resultStatusDict[testResult.complementaryData.status]?.description ?? 'UNKNOWN';

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
                    stacktrace: complementaryData.error.stack,
                } : {
                    error: complementaryData.error,
                    stacktrace: 'Cannot retrieve stacktrace',
                };
        } else if (complementaryDataIsPostRequestErrorData(complementaryData)) {
            complementaryBody = complementaryData.error instanceof Error ?
                {
                    error: complementaryData.error.message,
                    stacktrace: complementaryData.error.stack,
                    decodedData: stringify(complementaryData.decodedData),
                } : {
                    error: complementaryData.error,
                    stacktrace: 'Cannot retrieve stacktrace',
                    decodedData: stringify(complementaryData.decodedData),
                };
        } else if (complementaryDataIsSuccessData(complementaryData)) {
            complementaryBody = {
                decodedData: stringify(complementaryData.decodedData),
                axiosResponse: stringify(complementaryData.axiosResponse),
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
        // console.log(stringify(body))

        return {
            dateTime: dateTime,
            title: title,
            resultDescription: description,
            body: body,
        } as LogData;
    });
}

export function writeLogs(logsData: LogData[], logPath: string) {
    const logString = logsDataToString(logsData);
    appendFileSync(logPath, logString);
}

export function logsDataToString(logsData: LogData[]): string {
    let str = '';
    if (!logsData.length) return str;

    const maxTitleLength = Math.max(...(logsData.map(logData => logData.title.length)));
    const titleIndentation = maxTitleLength + logsData[0].dateTime.length + 1;

    logsData.forEach(logData => {
        const fullTitle = `${logData.title}${' '.repeat(maxTitleLength - logData.title.length)}`;
        let body = stringify(logData.body);
        console.log('a');
        console.log(stringify(body));
        body = body.substring(1, body.length).substring(0, body.length - 3);
        console.log('b');
        console.log(stringify(body));
        body = replaceAll(body, '\n', `\n${' '.repeat(titleIndentation)}`);
        console.log('c');
        console.log(stringify(body));
        str += `${logData.dateTime} ${fullTitle}: ${logData.resultDescription}${body}\n\n`;
    });

    return str;
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