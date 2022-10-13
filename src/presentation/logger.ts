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
import { LogData } from './LogData';
const {format} = require('@redtea/format-axios-error');

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

export function testResultsToLogsData<T>(testResults: TestResult<T>[]): LogData[] {
    return testResults.map((testResult: TestResult<T>) => {
        const dateTime = dateFormat(new Date(testResult.timestamp), config.dateFormat);
        const title = resultStatusDict[testResult.complementaryData.status]?.title ?? 'UNKNOWN';
        const description = resultStatusDict[testResult.complementaryData.status]?.description ?? 'UNKNOWN';

        const complementaryData = testResult.complementaryData;
        let complementaryBody: any;
        if (complementaryDataIsRequestErrorData(complementaryData)) {
            complementaryBody = {
                error: complementaryData.error.message,
                stacktrace: format(complementaryData.error),
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
                    decodedData: complementaryData.decodedData,
                    error: complementaryData.error.message,
                    stacktrace: complementaryData.error.stack,
                } : {
                    decodedData: complementaryData.decodedData,
                    error: complementaryData.error,
                    stacktrace: 'Cannot retrieve stacktrace',
                };
        } else if (complementaryDataIsSuccessData(complementaryData)) {
            complementaryBody = {
                decodedData: complementaryData.decodedData,
                rawData: complementaryData.axiosResponse.data,
                headers: complementaryData.axiosResponse.headers,
                status: complementaryData.axiosResponse.status,
                statusText: complementaryData.axiosResponse.statusText,
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

export function logsDataToString(logsData: LogData[]): string {
    let str = '';
    if (!logsData.length) return str;

    const maxTitleLength = Math.max(...(logsData.map(logData => logData.title.length)));
    const titleIndentation = maxTitleLength + logsData[0].dateTime.length + 1;

    logsData.forEach(logData => {
        const fullTitle = `${logData.title}${' '.repeat(maxTitleLength - logData.title.length)}`;
        let body = stringify(logData.body);
        body = body.substring(1, body.length).substring(0, body.length - 3);
        body = replaceAll(body, '\n', `\n${' '.repeat(titleIndentation)}`);
        str += `${logData.dateTime} ${fullTitle}: ${logData.resultDescription}${body}\n\n`;
    });

    return str;
}

export function writeLogs(testResults: TestResult<any>[]) {
    const logPath = getLogPath();
    const logsData = testResultsToLogsData(testResults);
    const logString = logsDataToString(logsData);
    appendFileSync(logPath, logString);
}