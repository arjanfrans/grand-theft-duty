import { CommandInterface } from "../CommandInterface";
import glob from "glob-promise";
import path from "path";
import { StringUtil } from "../../engine/utils/StringUtil";
import { AudioSprite } from "../../engine/tools/audiosprite/AudioSprite";

interface AudiospriteCommandOptions {
    input: string;
    output: string;
    export: string;
}

export class AudiospriteCommand
    implements CommandInterface<AudiospriteCommandOptions>
{
    async execute(options: AudiospriteCommandOptions): Promise<number> {
        const directories: string[] = await glob(
            path.join(options.input, "*/")
        );

        console.log("Using options:");
        console.table(options);

        for (const directory of directories) {
            const name = StringUtil.baseDirectory(directory);
            const files = await glob(
                path.join(directory, "**/*.{ogg,mp3,m4a,ac3}")
            );

            if (files.length > 0) {
                await AudioSprite(files, {
                    export: options.export,
                    format: "howler",
                    output: path.join(options.output, name),
                    path: ".",
                });

                console.log(
                    `Audiosprite ${name} written to ${path.resolve(
                        options.output
                    )}/${name}.{${options.export}|json}`
                );
            } else {
                console.warn(`No files found in directory ${directory}`);
            }
        }

        return 0;
    }
}
