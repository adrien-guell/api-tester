import chalk from "chalk";
import axios, {AxiosError} from "axios";
import {appendFileSync} from "fs";

export function promptFail(
    endpointRoute: string,
    showDetails: boolean,
    logFilename: string,
    error: AxiosError | Error | any
) {
    const failMessage = `${endpointRoute} - Failed`;
    const errorDetail = ` : ${axios.isAxiosError(error) ? error.message : error}`;
    console.log(chalk.red(failMessage + (showDetails ? errorDetail : "")));
    appendFileSync(logFilename, failMessage + errorDetail + `\n`);
}

export function promptApiThatIsTested(apiUrl: string) {
    const text = `│ Testing api ${apiUrl} │`;
    const bar = "―".repeat(text.length - 2);
    console.log(chalk.blue(`╭${bar}╮`));
    console.log(chalk.blue(text));
    console.log(chalk.blue(`╰${bar}╯`));
}
