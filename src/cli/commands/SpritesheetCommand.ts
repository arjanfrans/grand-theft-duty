import { CommandInterface } from "../CommandInterface";
import glob from "glob-promise";
import * as path from "path";
import { generate } from "../../engine/tools/spritesheet";
import { Format } from "../../engine/tools/spritesheet/Format";

export interface SpritesheetCommandOptions {
    input: string;
    output: string;
    extrude: number;
}

export class SpritesheetCommand
    implements CommandInterface<SpritesheetCommandOptions>
{
    async execute(options: SpritesheetCommandOptions): Promise<number> {
        const directories: string[] = await glob(
            path.join(options.input, "*/")
        );

        console.log("Using options:");
        console.table(options);

        for (const directory of directories) {
            const name = SpritesheetCommand.baseDirectory(directory);
            const files = await glob(path.join(directory, "**/*.png"));

            if (files.length > 0) {
                await generate(files, {
                    format: Format.JSON_ARRAY,
                    name,
                    powerOfTwo: true,
                    padding: 2,
                    extrude: options.extrude,
                    path: options.output,
                });

                console.log(
                    `Spritesheet ${name} written to ${path.resolve(
                        options.output
                    )}/${name}.{png|json}`
                );
            } else {
                console.warn(`No files found in directory ${directory}`);
            }
        }

        return 0;
    }

    private static baseDirectory(value: string): string {
        return value
            .split("/")
            .filter((el) => el.trim().length > 0)
            .pop() as string;
    }
}
