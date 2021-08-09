import ViewContainer from '../../engine/graphics/ViewContainer';

import StatsRenderView from './ui/StatsRenderView';
import AmmoView from './ui/AmmoView';
import HealthView from './ui/HealthView';
import WeaponView from './ui/WeaponView';
import ScoreView from './ui/ScoreView';

import BulletSystemView from './views/BulletSystemView';
import WorldMapView from './views/WorldMapView';
import SoldierView from './views/SoldierView';
import SoldierViewPool from './views/SoldierViewPool';
import {PlayRenderView} from './views/PlayRenderView';

export const ViewBuilder = {
    uiView (playState) {
        const uiView = new StatsRenderView(playState);
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
        const playView = new PlayRenderView(playState);

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
        playView.cameraFollowView = playerView;

        return playView;
    }
};
