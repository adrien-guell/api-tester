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
    '    padding: 1em;\n' +
    '    margin: 0;\n' +
    '    height: 100%;\n' +
    '    font-family: \'Roboto\', sans-serif;\n' +
    '}\n' +
    '\n' +
    'h1 {\n' +
    '    display: block;\n' +
    '    font-size: 1.5em;\n' +
    '    margin: 0.67em 0;\n' +
    '    font-weight: bold;\n' +
    '}\n' +
    '\n' +
    'table {\n' +
    '    border-collapse: collapse;\n' +
    '    font-size: 1em;\n' +
    '    border: none;\n' +
    '}\n' +
    '\n' +
    'thead {\n' +
    '}\n' +
    '\n' +
    '.post,\n' +
    '.delete,\n' +
    '.get,\n' +
    '.put,\n' +
    '.patch {\n' +
    '    text-align: center;\n' +
    '    color: #ffffff;\n' +
    '    background-clip: padding-box;\n' +
    '    font-weight: bold;\n' +
    '}\n' +
    '\n' +
    '.get {\n' +
    '    /*background-color: #057e0b;*/\n' +
    '    color: #14c21c;\n' +
    '}\n' +
    '\n' +
    '.post {\n' +
    '    /*background-color: #81530f;*/\n' +
    '    color: #cb8115;\n' +
    '}\n' +
    '\n' +
    '.put {\n' +
    '    /*background-color: #0c5e77;*/\n' +
    '    color: #1396be;\n' +
    '}\n' +
    '\n' +
    '.patch {\n' +
    '    /*background-color: #510c73;*/\n' +
    '    color: #9017cc;\n' +
    '}\n' +
    '\n' +
    '.delete {\n' +
    '    /*background-color: #881033;*/\n' +
    '    color: #d5154d;\n' +
    '}\n' +
    '\n' +
    '.success,\n' +
    '.failed {\n' +
    '    color: #ffffff;\n' +
    '    font-weight: bold;\n' +
    '    border-radius: 0.7em;\n' +
    '    padding: 0.4em;\n' +
    '    display: inline;\n' +
    '}\n' +
    '\n' +
    '.success {\n' +
    '    background-color: #077a12;\n' +
    '}\n' +
    '\n' +
    '.failed {\n' +
    '    background-color: #9a1111;\n' +
    '}\n' +
    '\n' +
    'td,\n' +
    'th {\n' +
    '    text-align: left;\n' +
    '    padding: 10px;\n' +
    '}\n' +
    '\n' +
    'tr:hover {\n' +
    '    background-color: #ececec;\n' +
    '}\n' +
    '\n' +
    'td {\n' +
    '    text-align: center;\n' +
    '\n' +
    '    color: #383838;\n' +
    '}\n' +
    '\n' +
    'th {\n' +
    '    padding-right: 2em;\n' +
    '    background: #383838;\n' +
    '    color: #ffffff;\n' +
    '}\n'