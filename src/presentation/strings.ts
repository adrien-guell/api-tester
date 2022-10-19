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

export const cssString: string = 'body {\n' +
    '            padding: 1em;\n' +
    '            margin: 0;\n' +
    '            height: 100%;\n' +
    '            font-family: \'Roboto\', sans-serif;\n' +
    '        }\n' +
    '        details{\n' +
    '            margin-bottom: 1em;\n' +
    '        }\n' +
    '\n' +
    '        h1 {\n' +
    '            display: inline;\n' +
    '            font-size: 1.5em;\n' +
    '            margin: 0.67em 0;\n' +
    '            font-weight: bold;\n' +
    '        }\n' +
    '\n' +
    '\n' +
    '        table {\n' +
    '            table-layout: fixed;\n' +
    '            width: 100%;\n' +
    '            border-spacing: 0 0.5em;\n' +
    '            font-size: 1em;\n' +
    '            border: none;\n' +
    '        }\n' +
    '\n' +
    '\n' +
    '        td, th {\n' +
    '            word-wrap: break-word;\n' +
    '            text-align: left;\n' +
    '            padding: 5px;\n' +
    '        }\n' +
    '\n' +
    '\n' +
    '        td {\n' +
    '            overflow: auto;\n' +
    '            text-overflow: clip;\n' +
    '            color: #383838;\n' +
    '        }\n' +
    '\n' +
    '        th {\n' +
    '            background: #383838;\n' +
    '            color: #ffffff;\n' +
    '        }\n' +
    '\n' +
    '        tr:hover {\n' +
    '            background-color: #ececec;\n' +
    '        }\n' +
    '\n' +
    '        .post, .delete, .get, .put, .patch {\n' +
    '            text-align: center;\n' +
    '\n' +
    '            color: #ffffff;\n' +
    '            background-clip: padding-box;\n' +
    '            font-weight: bold;\n' +
    '        }\n' +
    '\n' +
    '        .get {\n' +
    '            color: #14c21c;\n' +
    '        }\n' +
    '\n' +
    '        .post {\n' +
    '            color: #cb8115;\n' +
    '        }\n' +
    '\n' +
    '        .put {\n' +
    '            color: #1396be;\n' +
    '        }\n' +
    '\n' +
    '        .patch {\n' +
    '            color: #9017cc;\n' +
    '        }\n' +
    '\n' +
    '        .delete {\n' +
    '            color: #d5154d;\n' +
    '        }\n' +
    '\n' +
    '        td:has(.success,.failed){\n' +
    '            text-align: center;\n' +
    '        }\n' +
    '\n' +
    '        .success, .failed {\n' +
    '            font-size: 0.9em;\n' +
    '            display: inline-block;\n' +
    '            color: #ffffff;\n' +
    '            font-weight: normal;\n' +
    '            border-radius: 0.7em;\n' +
    '            padding: 0.4em;\n' +
    '        }\n' +
    '\n' +
    '        .description {\n' +
    '            width: 8%;\n' +
    '        }\n' +
    '\n' +
    '        .baseUrl {\n' +
    '            width: 16%;\n' +
    '        }\n' +
    '\n' +
    '        .endpoint {\n' +
    '            width: 16%;\n' +
    '        }\n' +
    '\n' +
    '        .status {\n' +
    '            text-align: center;\n' +
    '\n' +
    '            width: 13%;\n' +
    '        }\n' +
    '\n' +
    '        .method {\n' +
    '            text-align: center;\n' +
    '            width: 5%;\n' +
    '\n' +
    '        }\n' +
    '\n' +
    '        .error {\n' +
    '            height: auto;\n' +
    '        }\n' +
    '\n' +
    '        .dateTime {\n' +
    '            width: 8%;\n' +
    '\n' +
    '        }\n' +
    '\n' +
    '        .success {\n' +
    '            background-color: #077a12;\n' +
    '        }\n' +
    '\n' +
    '        .failed {\n' +
    '            background-color: #9a1111;\n' +
    '        }'