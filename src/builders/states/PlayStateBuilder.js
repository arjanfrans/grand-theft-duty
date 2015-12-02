import PlayState from '../../game/states/play/PlayState';
import PlayRenderView from '../../game/states/play/PlayRenderView';

import Systems from '../../engine/Systems';
import Views from '../../engine/views';
import ViewContainer from '../../engine/views/ViewContainer';

import Match from '../../game/logic/play/Match';
import PlayerInput from '../../game/input/play/PlayerInput';
import UiInput from '../../game/input/play/UiInput';
import ComputerInput from '../../game/input/play/ComputerInput';
import Player from '../../game/logic/play/entities/Player';

import PlayAudio from '../../game/audio/PlayAudio';

import SoldierView from '../../game/views/SoldierView';
import SoldierViewPool from '../../game/views/SoldierViewPool';

import StatsRenderView from '../../game/ui/StatsRenderView';

import Entities from '../../engine/entities';

import MapParser from '../../engine/maps/MapParser';

let _createPlayView = function (state) {
    let playView = new PlayRenderView(state);

    // Dynamic Views
    let playerView = new SoldierView(state.player);
    let soldierView = new SoldierViewPool(state.soldiers);
    let bulletSystemView = new Views.BulletSystem(state.bulletSystem);
    let worldMapView = new Views.WorldMap(state.map);

    let viewContainer = new ViewContainer();

    viewContainer.addDynamicView(playerView);
    viewContainer.addDynamicView(soldierView);
    viewContainer.addDynamicView(bulletSystemView);
    viewContainer.addDynamicView(worldMapView);

    playView.addViewContainer('main', viewContainer);
    playView.currentViewContainer = 'main';

    // Camera follow
    playView.cameraFollowView = playerView;

    return playView;
};

let createPlayState = function (mapName, cpuCount) {
    let map = MapParser.parse(mapName);
    let match = new Match(['german', 'american']);
    let state = new PlayState(match, map);

    for (let i = 0; i < cpuCount; i++) {
        let soldier = new Entities.Soldier(350 + (100 * i), 450, 900, 48, 48, 1, 'american');

        state.inputs.add(new ComputerInput(soldier));

        match.addSoldier(soldier);
    }

    let player = new Player(350, 350, 400, 48, 48, 1, 'american');

    state.player = player;

    let playerInput = new PlayerInput(state.player);

    match.addSoldier(player, 'american');
    state.inputs.add(playerInput);

    let collisionSystem = new Systems.Collision(state);
    let bulletSystem = new Systems.Bullet(state);

    state.bulletSystem = bulletSystem;
    state.collisionSystem = collisionSystem;
    state.audio = new PlayAudio(state, 'guns', 'background');

    let playView = _createPlayView(state);

    state.addView(playView);

    return state;
};

let PlayStateBuilder = {
    create (engine) {
        let state = createPlayState('level2', 8);
        let statsView = new StatsRenderView(state);

        state.addView(statsView);

        let uiInput = new UiInput(statsView);

        state.inputs.add(uiInput);

        return state;
    }
};

export default PlayStateBuilder;
