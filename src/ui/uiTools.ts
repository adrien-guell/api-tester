import chalk from "chalk";

export function promptSuccessDecoding(endpointRoute: string) {
    console.log(chalk.green(`Decoded successfully: ${endpointRoute}`));
}

export function promptErrorDecoding(endpointRoute: string) {
    console.log(chalk.red(`Decoding error: ${endpointRoute}`));
}
