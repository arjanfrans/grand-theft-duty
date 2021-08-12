import { PlayState } from "./PlayState";
import { ViewBuilder } from "./ViewBuilder";

import { Match } from "../../core/Match";
import { PlayerInput } from "./input/PlayerInput";
import { UiInput } from "./input/UiInput";
import { Player } from "../../core/entities/Player";

import PlayAudio from "./PlayAudio";
import MapParser from "../../core/maps/MapParser";
import AssetManager from "../../engine/AssetManager";

import { Soldier } from "../../core/entities/Soldier";
import { CollisionUpdateSystem } from "../update-system/CollisionUpdateSystem";
import { BulletUpdateSystem } from "../update-system/BulletUpdateSystem";
import { ControllerUpdateSystem } from "../../engine/system/ControllerUpdateSystem";
import { ComputerInput } from "./input/ComputerInput";
import { PauseUpdateSystem } from "../update-system/PauseUpdateSystem";
import { AudioUpdateSystem } from "../update-system/AudioUpdateSystem";
import { MatchUpdateSystem } from "../update-system/MatchUpdateSystem";

/**
 * Create CPU soldiers.
 *
 * @param {PlayState} state The play state.
 * @param {number} count Number of CPU soldiers.
 *
 * @return {void}
 */
function createCpuSoldiers(state, count): Soldier[] {
    const soldiers: Soldier[] = [];

    for (let i = 0; i < count; i++) {
        const { x, y, z } = state.map.randomRespawnPosition();
        const soldier = new Soldier(x, y, z, 48, 48, 1, "american");

        state.match.addSoldier(soldier);
        soldiers.push(soldier);
    }

    return soldiers;
}

/**
 * Create the player entity and add it to the play state.
 *
 * @param {PlayState} state The play state.
 * @param {string} name Name of the player.
 *
 * @param dead
 * @return {void}
 */
function createPlayer(engine, state, name, dead = false): Player {
    const { x, y, z } = state.map.randomRespawnPosition();
    const player = new Player(x, y, z, 48, 48, 1, "american");

    state.player = player;

    player.kill();

    state.match.addSoldier(player, "american");

    return player;
}

/**
 * Create the views for the play state.
 *
 * @param {PlayState} state The play state.
 *
 * @return {void}
 */
function createViews(state) {
    state.addView(ViewBuilder.playView(state));
    state.addView(ViewBuilder.uiView(state));
}

const PlayBuilder = {
    createSingleplayer(engine, options) {
        const map = MapParser.parse(AssetManager.getMap(options.map));
        const match = new Match(options.teams);
        const state = new PlayState(engine, match, map);

        const soldiers = createCpuSoldiers(state, options.cpuCount);
        const player = createPlayer(engine, state, options.playerName);

        state.addSystem(
            new ControllerUpdateSystem([
                new UiInput(engine.inputSources, state),
                new PlayerInput(engine.inputSources, player),
                ...soldiers.map((soldier) => new ComputerInput(soldier)),
            ]),
            0
        );
        state.addSystem(new PauseUpdateSystem(), 1);
        state.addSystem(
            new AudioUpdateSystem(new PlayAudio(state, "guns", "background")),
            2
        );
        state.addSystem(new BulletUpdateSystem(state), 3);
        state.addSystem(new MatchUpdateSystem(state), 4);
        state.addSystem(new CollisionUpdateSystem(state), 5);

        createViews(state);

        return state;
    },
};

export default PlayBuilder;
