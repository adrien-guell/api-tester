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