import { Command } from "commander";
import { SpritesheetCommand } from "./commands/SpritesheetCommand";
import { AudiospriteCommand } from "./commands/AudiospriteCommand";
import { InstallRequirementsCommand } from "./commands/InstallRequirementsCommand";

const program = new Command();

program
    .command("install-requirements")
    .option("-s --sudo", "Run as sudo", false)
    .action(async (options) => {
        process.exit(await new InstallRequirementsCommand().execute(options));
    });

program
    .command("spritesheet <input> <output>")
    .option("-e --extrude <extrude>", "Extrude", "0")
    .action(
        async (input: string, output: string, options: { extrude: string }) => {
            process.exit(
                await new SpritesheetCommand().execute({
                    extrude: Number.parseInt(options.extrude),
                    input,
                    output,
                })
            );
        }
    );

program
    .command("audiosprite <input> <output>")
    .option("-e --export <export>", "Export format", "ogg")
    .action(
        async (input: string, output: string, options: { export: string }) => {
            process.exit(
                await new AudiospriteCommand().execute({
                    export: options.export,
                    input,
                    output,
                })
            );
        }
    );

program.parse();
