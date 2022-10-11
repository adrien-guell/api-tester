import * as fs from 'fs';

const htmlCreator = require('html-creator');

const reportPath = 'apitester_reports\\apitester_reports.html';

export function createHtmlReport() {
    const htmlReport = new htmlCreator([
        {
            type: 'head',
            content: [
                {
                    type: 'title',
                    content: 'Api-Tester Report',
                },
                {
                    type: 'script',
                    attributes: {
                        src: 'https://www.kryogenix.org/code/browser/sorttable/sorttable.js',
                    },
                },
                {
                    type: 'style',
                    content:
                        'body {padding: 1em;margin: 0;height: 100%;' +
                        "font-family: 'Roboto', sans-serif;" +
                        '}h1 {display: block;font-size: 1.5em;margin: 0.67em 0;font-weight: bold;}table {border-collapse: collapse;font-size: 1em;border: none;}thead {}.post, .delete, .get, .put, .patch {text-align: center;color: #ffffff;background-clip: padding-box;font-weight: bold;}.get {/*background-color: #057e0b;*/color: #14c21c;}.post {/*background-color: #81530f;*/color: #cb8115;}.put {/*background-color: #0c5e77;*/color: #1396be;}.patch {/*background-color: #510c73;*/color: #9017cc;}.delete {/*background-color: #881033;*/color: #d5154d;}.success, .failed {color: #ffffff;font-weight: bold;border-radius: 0.7em;padding: 0.4em;display: inline;}.success {background-color: #077a12;}.failed {background-color: #9a1111;}td, th {text-align: left;padding: 10px;}tr:hover {background-color: #ececec;}td {text-align: center;color: #383838;}th {padding-right: 2em;background: #383838;color: #ffffff;}',
                },
            ],
        },
        {
            type: 'body',
            attributes: { style: 'padding: 1rem' },
            content: [
                getTittle(),
                {
                    type: 'table',
                    attributes: { class: 'sortable' },
                    content: [getTableConfig(), getTableData(), getTableData()],
                },
            ],
        },
    ]);

    if (!fs.existsSync('apitester_reports')) {
        fs.mkdirSync('apitester_reports');
    }
    if (fs.existsSync(reportPath)) {
        fs.unlinkSync(reportPath);
    }
    fs.appendFileSync(reportPath, htmlReport.renderHTML());
}

function getTittle() {
    return {
        type: 'h1',
        content: 'https://api.thecatapi.com/v1/',
    };
}

function getTableConfig() {
    return {
        type: 'thead',
        content: [
            {
                type: 'tr',
                content: [
                    {
                        type: 'th',
                        content: 'Base url',
                    },
                    {
                        type: 'th',
                        content: 'Endpoint',
                    },
                    {
                        type: 'th',
                        content: 'State',
                    },
                ],
            },
        ],
    };
}

function getTableData() {
    return {
        type: 'tbody',
        content: [
            {
                type: 'tr',
                content: [
                    {
                        type: 'td',
                        content: 'Base url',
                    },
                    {
                        type: 'td',
                        content: 'Endpoint',
                    },
                    {
                        type: 'td',
                        content: [
                            {
                                type: 'div',
                                content: 'Success',
                                attributes: { class: 'success' },
                            },
                        ],
                    },
                ],
            },
        ],
    };
}
