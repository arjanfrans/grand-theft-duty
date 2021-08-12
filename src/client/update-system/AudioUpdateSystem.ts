import { SystemUpdateInterface } from "../../engine/system/SystemUpdateInterface";
import { StateAudio } from "../StateAudio";

export class AudioUpdateSystem implements SystemUpdateInterface {
    private audio: StateAudio;

    constructor(audio: StateAudio) {
        this.audio = audio;
    }

    update(delta: number): boolean {
        this.audio.update(delta);

        return true;
    }
}
