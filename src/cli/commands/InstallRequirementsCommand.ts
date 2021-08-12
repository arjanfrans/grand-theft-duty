import * as util from "util";
import { exec as execChildProcess } from "child_process";
import { CommandInterface } from "../CommandInterface";

const exec = util.promisify(execChildProcess);

interface InstallRequirementsCommandOptions {
    sudo: boolean;
}

export class InstallRequirementsCommand
    implements CommandInterface<InstallRequirementsCommandOptions>
{
    async execute(options: InstallRequirementsCommandOptions): Promise<number> {
        const linux = [
            `${
                options.sudo ? "sudo " : ""
            }apt-get install -y ffmpeg imagemagick`,
        ];

        const { stdout, stderr } = await exec(linux.join("\n"));

        console.log(stdout);

        if (stderr) {
            console.error(stderr);

            return 1;
        }

        return 0;
    }
}
