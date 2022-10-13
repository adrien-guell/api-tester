import Dict = NodeJS.Dict;

export const resultStatusDict: Dict<{ title: string, description: string }> = {
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
    }
};