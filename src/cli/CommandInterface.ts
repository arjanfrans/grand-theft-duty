export interface CommandInterface<Options> {
    execute(options: Options): Promise<number>;
}
