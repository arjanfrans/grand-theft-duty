import ViewContainer from '../../engine/graphics/ViewContainer';

import {StatsScene} from '../../scene/StatsScene';
import AmmoView from '../../views/AmmoView';
import HealthView from '../../views/HealthView';
import WeaponView from '../../views/WeaponView';
import ScoreView from '../../views/ScoreView';

import BulletSystemView from './views/BulletSystemView';
import WorldMapView from './views/WorldMapView';
import SoldierView from './views/SoldierView';
import {SoldierViewPool} from './views/SoldierViewPool';
import {PlayScene} from '../../scene/PlayScene';

export const ViewBuilder = {
    uiView (playState) {
        const uiView = new StatsScene(playState);
        const uiViewContainer = new ViewContainer();

        const scoreView = new ScoreView(playState);
        const weaponView = new WeaponView(playState);
        const ammoView = new AmmoView(playState);
        const healthView = new HealthView(playState);

        uiViewContainer.addDynamicView(scoreView, { x: 100, y: 100, z: 0 });
        uiViewContainer.addDynamicView(weaponView, { x: 280, y: 540, z: 0 });
        uiViewContainer.addDynamicView(ammoView, { x: 10, y: 540, z: 0 });
        uiViewContainer.addDynamicView(healthView, { x: 600, y: 540, z: 0 });
        uiView.addViewContainer('main', uiViewContainer);
        uiView.currentViewContainer = 'main';

        return uiView;
    },

    playView (playState) {
        const playView = new PlayScene(playState);

        const playerView = new SoldierView(playState.player);
        const soldierView = new SoldierViewPool(playState.soldiers);
        const bulletSystemView = new BulletSystemView(playState.bulletSystem);
        const worldMapView = new WorldMapView(playState.map);

        const viewContainer = new ViewContainer();

        viewContainer.addDynamicView(playerView);
        viewContainer.addDynamicView(soldierView);
        viewContainer.addDynamicView(bulletSystemView);
        viewContainer.addDynamicView(worldMapView);

        playView.addViewContainer('main', viewContainer);
        playView.currentViewContainer = 'main';

        // Camera follow
        playView._cameraFollowView = playerView;

        return playView;
    }
};
