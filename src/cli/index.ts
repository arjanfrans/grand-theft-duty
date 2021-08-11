import { Command } from "commander";
import { SpritesheetCommand } from "./commands/SpritesheetCommand";

const program = new Command();

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

program.parse();
