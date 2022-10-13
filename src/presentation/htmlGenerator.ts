import Dict = NodeJS.Dict;
import { ResultStatus } from '../business/models/TestResult';
import { Method } from 'axios';
import { resultStatusDict } from './strings';
import { groupBy } from '../utils';

export type HtmlReportData = {
    description: string,
    baseUrl: string,
    endpoint: string,
    status: ResultStatus,
    method: Method
    error: string,
    dateTime: string,
}

export function getBody(htmlReportsData: HtmlReportData[]) {
    const htmlReportsMap = groupBy(htmlReportsData, (htmlReportData) => htmlReportData.baseUrl)
    let html = ""
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
            ])
        ),
        TableBody(
            htmlReportsData.map(getRow)
        )
    )
}

export function getRow(htmlReportData: HtmlReportData) {
    return TableRow([
       TableData(htmlReportData.description),
        TableData(htmlReportData.baseUrl),
        TableData(htmlReportData.endpoint),
        TableData(
            Div(
                resultStatusDict[htmlReportData.status]?.title,
                {
                    class: resultStatusDict[htmlReportData.status]?.class
                }
            )
        ),
        TableData(
            Div(
                htmlReportData.method.toUpperCase(),
                {
                    class: htmlReportData.method
                }
            )
        ),
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
    `<td${attrToString(attributes)}>${content}<td/>`;

export const TableRow = (tableHeadersOrData: string[], attributes?: Dict<string>) =>
    `<tr${attrToString(attributes)}>${tableHeadersOrData.join('')}<tr/>`

export const TableBody = (tableRows: string[], attributes?: Dict<string>) =>
    `<tbody${attrToString(attributes)}>${tableRows.join('')}<tbody/>`

export const TableHead = (tableRow: string, attributes?: Dict<string>) =>
    `<thead${attrToString(attributes)}>${tableRow}<thead/>`

export const TableHeader = (content: string, attributes?: Dict<string>) =>
    `<th${attrToString(attributes)}>${content}<th/>`;

export const Table = (tableHead: string, tableBody: string, attributes?: Dict<string>) =>
    `<thead${attrToString(attributes)}>${tableHead}${tableBody}<thead/>`

export const Header1 = (content?: string, attributes?: Dict<string>) =>
    `<h1${attrToString(attributes)}>${content}</h1>`;

export const Body = (content?: string) =>
    `<body>${content}</body>`;