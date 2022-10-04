import chalk from "chalk";

export function promptSuccessDecoding(endpointRoute: string) {
    console.log(chalk.green(`Decoded successfully: ${endpointRoute}`));
}

export function promptErrorDecoding(endpointRoute: string) {
    console.log(chalk.red(`Decoding error: ${endpointRoute}`));
}

export function promptApiThatIsTested(apiUrl: string) {
    const text = `| Testing api ${apiUrl} |`;
    const bar = "_".repeat(text.length);
    console.log(chalk.blue(bar));
    console.log(chalk.blue(text));
    console.log(chalk.blue(bar));
}
