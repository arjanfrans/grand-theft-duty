export class StringUtil {
    private constructor() {}

    public static baseDirectory(value: string): string {
        return value
            .split("/")
            .filter((el) => el.trim().length > 0)
            .pop() as string;
    }
}
