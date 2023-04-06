import chalk from 'chalk';
import { TestResult } from '../business/models/TestResult';
import { groupBy, replaceAll, stringify } from '../utils';
import { format } from '@redtea/format-axios-error';

export function printFailure(
    errorType: string,
    description: string | undefined,
    route: string,
    error: any,
    verbose: boolean,
) {
    const title = `${description ?? route} - `
    const indentation = ' '.repeat(title.length);
    const stringError = typeof error != "string" ? stringify(error) : error
    const errorMessage = verbose ? `\n${indentation}${replaceAll(stringError, '\n', `\n${indentation}`)}` : '';
    console.log(chalk.red(`${title}${errorType}${errorMessage}`));
}

export function printApi(apiUrl: string) {
    const text = `│ Testing api ${apiUrl} │`;
    const bar = '―'.repeat(text.length - 2);
    console.log(chalk.blue(`╭${bar}╮`));
    console.log(chalk.blue(text));
    console.log(chalk.blue(`╰${bar}╯`));
}

export function printResults(testResults: TestResult<unknown>[], verbose: boolean) {
    const mappedResults = groupBy(testResults, (testResult) => testResult.baseUrl);

    for (const [api, testResults] of mappedResults) {
        printApi(api);
        testResults.forEach((testResult) => {
            const complementaryData = testResult.complementaryData;
            switch (complementaryData.status) {
                case 'requestError':
                    printFailure(
                        'Request failed',
                        testResult.description,
                        testResult.route,
                        format(complementaryData.error),
                        verbose
                    );
                    break;
                case 'beforeDecodeError':
                    printFailure(
                        'Before decode failed',
                        testResult.description,
                        testResult.route,
                        complementaryData.error,
                        verbose
                    );
                    break;
                case 'decodeError':
                    printFailure(
                        'Decoding failed',
                        testResult.description,
                        testResult.route,
                        complementaryData.error,
                        verbose
                    );
                    break;
                case 'postRequestError':
                    printFailure(
                        'Post request validation failed',
                        testResult.description,
                        testResult.route,
                        complementaryData.error,
                        verbose
                    );
                    break;
                case 'success':
                    console.log(chalk.green(`${testResult.description ?? testResult.route} - Success`));
                    break;

            }
        });
    }
}
