import Dict = NodeJS.Dict;
import {
    complementaryDataIsDecodeErrorData,
    complementaryDataIsPostRequestErrorData,
    complementaryDataIsRequestErrorData,
    ResultStatus,
    TestResult,
} from '../business/models/TestResult';
import { Method } from 'axios';
import { resultStatusDict } from './strings';
import { cssString } from './strings';
import { groupBy } from '../utils';
import fs from 'fs';
import * as config from '../../config.json';
import dateFormat from 'dateformat';
import * as path from 'path';

export type HtmlReportData = {
    description: string;
    baseUrl: string;
    endpoint: string;
    status: ResultStatus;
    method: Method;
    error: string;
    dateTime: string;
};

export function testResultsToHtmlReportsData(testResults: TestResult<any>[]) {
    return testResults.map((testResult) => {
        let error: string;
        if (complementaryDataIsDecodeErrorData(testResult.complementaryData)) {
            error = testResult.complementaryData.error;
        } else if (complementaryDataIsPostRequestErrorData(testResult.complementaryData)) {
            error = testResult.complementaryData.error;
        } else if (complementaryDataIsRequestErrorData(testResult.complementaryData)) {
            error = testResult.complementaryData.error.message;
        } else {
            error = 'none';
        }

        return {
            description: testResult.description ?? 'No description',
            baseUrl: testResult.baseUrl,
            endpoint: testResult.route,
            status: testResult.complementaryData.status,
            method: testResult.method,
            error: error,
            dateTime: dateFormat(new Date(testResult.timestamp), config.dateFormat),
        };
    });
}


export function writeHtmlReport(testResults: TestResult<any>[], reportFilename?: string) {
    const htmlReportsData = testResultsToHtmlReportsData(testResults);
    const htmlReport = Html(Header('Api Tester Report', cssString), getBody(htmlReportsData));

    if (!fs.existsSync(config.reportDefaultDirectory)) {
        fs.mkdirSync(config.reportDefaultDirectory);
    }

    fs.writeFileSync(
        path.join(
            config.reportDefaultDirectory,
            reportFilename ?? `${config.reportDefaultFileName}-${Date.now()}.html`,
        ),
        htmlReport,
        { flag: 'w' },
    );
}

export function getBody(htmlReportsData: HtmlReportData[]) {
    const htmlReportsMap = groupBy(htmlReportsData, (htmlReportData) => htmlReportData.baseUrl);
    let html = '';
    for (const [api, htmlReportsData] of htmlReportsMap) {
        html += Header1(api) + getTable(htmlReportsData);
    }
    return Body(html);
}

export function getTable(htmlReportsData: HtmlReportData[]) {
    return Table(
        TableHead(
            TableRow([
                TableHeader('Description'),
                TableHeader('Baseurl'),
                TableHeader('Endpoint'),
                TableHeader('Status'),
                TableHeader('Method'),
                TableHeader('Error'),
                TableHeader('Datetime'),
            ]),
        ),
        TableBody(htmlReportsData.map(getRow)),
    );
}

export function getRow(htmlReportData: HtmlReportData) {
    return TableRow([
        TableData(htmlReportData.description),
        TableData(htmlReportData.baseUrl),
        TableData(htmlReportData.endpoint),
        TableData(
            Div(resultStatusDict[htmlReportData.status]?.title, {
                class: resultStatusDict[htmlReportData.status]?.class,
            }),
        ),
        TableData(Div(htmlReportData.method.toUpperCase(), { class: htmlReportData.method })),
        TableData(htmlReportData.error),
        TableData(htmlReportData.dateTime),
    ]);
}

export function attrToString(attributes?: Dict<string>) {
    let stringAttr = '';
    if (!attributes) return stringAttr;
    for (const attributeName in attributes) {
        stringAttr += ` ${attributeName}="${attributes[attributeName]}"`;
    }
    return stringAttr;
}

export const Div = (content?: string, attributes?: Dict<string>) =>
    `<div${attrToString(attributes)}>${content}</div>`;

export const TableData = (content?: string, attributes?: Dict<string>) =>
    `<td${attrToString(attributes)}>${content}</td>`;

export const TableRow = (tableHeadersOrData: string[], attributes?: Dict<string>) =>
    `<tr${attrToString(attributes)}>${tableHeadersOrData.join('')}</tr>`;

export const TableBody = (tableRows: string[], attributes?: Dict<string>) =>
    `<tbody${attrToString(attributes)}>${tableRows.join('')}</tbody>`;

export const TableHead = (tableRow: string, attributes?: Dict<string>) =>
    `<thead${attrToString(attributes)}>${tableRow}</thead>`;

export const TableHeader = (content: string, attributes?: Dict<string>) =>
    `<th${attrToString(attributes)}>${content}</th>`;

export const Table = (tableHead: string, tableBody: string, attributes?: Dict<string>) =>
    `<table class="sortable">${tableHead}${tableBody}</table>`;

export const Header1 = (content?: string, attributes?: Dict<string>) =>
    `<h1${attrToString(attributes)}>${content}</h1>`;

export const Body = (content?: string) => `<body>${content}</body>`;

export const Header = (title: string, style: string) =>
    `<head><title>${title}</title><script src='https://www.kryogenix.org/code/browser/sorttable/sorttable.js'></script><style>${style}</style></head>`;

export const Html = (header: string, body: string) =>
    `<!DOCTYPE html><html lang='en'>${header}${body}</html>`;
