export class Context {
    private value: any = {};
    get = () => this.value;
    set = (value: any) => this.value = value;
}