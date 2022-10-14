import Dict = NodeJS.Dict;

export const resultStatusDict: Dict<{ title: string, description: string, class: string }> = {
    'requestError': {
        title: 'ERROR: REQUEST',
        description: 'An error occurred while sending the request',
        class: 'failed'
    },
    'decodeError': {
        title: 'ERROR: DECODE',
        description: 'An error occurred while decoding the received data',
        class: 'failed'
    },
    'postRequestError': {
        title: 'ERROR: POST-REQUEST',
        description: 'An error occurred while executing the post-request validation function',
        class: 'failed'
    },
    'success': {
        title: 'SUCCESS',
        description: 'Test finished successfully',
        class: 'success'
    }
};

export const cssString:string='body {\n' +
    '        padding: 1em;\n' +
    '        margin: 0;\n' +
    '        height: 100%;\n' +
    '        font-family: \'Roboto\', sans-serif;\n' +
    '    }\n' +
    '\n' +
    '    h1 {\n' +
    '        display: block;\n' +
    '        font-size: 1.5em;\n' +
    '        margin: 0.67em 0;\n' +
    '        font-weight: bold;\n' +
    '    }\n' +
    '\n' +
    '\n' +
    '    table {\n' +
    '        table-layout: fixed;\n' +
    '        width: 100%;\n' +
    '        border-collapse: collapse;\n' +
    '        font-size: 1em;\n' +
    '        border: none;\n' +
    '    }\n' +
    '\n' +
    '    thead {\n' +
    '    }\n' +
    '\n' +
    '    .post, .delete, .get, .put, .patch {\n' +
    '        text-align: center;\n' +
    '        color: #ffffff;\n' +
    '        background-clip: padding-box;\n' +
    '        font-weight: bold;\n' +
    '    }\n' +
    '\n' +
    '    .get {\n' +
    '        color: #14c21c;\n' +
    '    }\n' +
    '\n' +
    '    .post {\n' +
    '        color: #cb8115;\n' +
    '    }\n' +
    '\n' +
    '    .put {\n' +
    '        color: #1396be;\n' +
    '    }\n' +
    '\n' +
    '    .patch {\n' +
    '        color: #9017cc;\n' +
    '    }\n' +
    '\n' +
    '    .delete {\n' +
    '        color: #d5154d;\n' +
    '    }\n' +
    '\n' +
    '    .success, .failed {\n' +
    '        color: #ffffff;\n' +
    '        font-weight: bold;\n' +
    '        border-radius: 0.7em;\n' +
    '        padding: 0.4em;\n' +
    '    }\n' +
    '\n' +
    '\n' +
    '    .success {\n' +
    '        background-color: #077a12;\n' +
    '    }\n' +
    '\n' +
    '    .failed {\n' +
    '        background-color: #9a1111;\n' +
    '    }\n' +
    '\n' +
    '    td, th {\n' +
    '        text-align: center;\n' +
    '        padding: 5px;\n' +
    '    }\n' +
    '\n' +
    '    tr:hover {\n' +
    '        background-color: #ececec;\n' +
    '    }\n' +
    '\n' +
    '    td {\n' +
    '        max-width: 0;\n' +
    '        overflow: hidden;\n' +
    '        text-overflow: clip;\n' +
    '        text-align: center;\n' +
    '        color: #383838;\n' +
    '    }\n' +
    '\n' +
    '    th {\n' +
    '        background: #383838;\n' +
    '        color: #ffffff;\n' +
    '    }\n' +
    '\n' +
    '    th {\n' +
    '\n' +
    '    }\n' +
    '\n' +
    '    table {\n' +
    '        border-collapse: collapse;\n' +
    '    }'