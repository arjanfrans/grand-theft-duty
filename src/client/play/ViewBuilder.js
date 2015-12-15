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
import PlayRenderView from './views/PlayRenderView';

let ViewBuilder = {
    uiView (playState) {
        let uiView = new StatsRenderView(playState);
        let uiViewContainer = new ViewContainer();

        let scoreView = new ScoreView(playState);
        let weaponView = new WeaponView(playState);
        let ammoView = new AmmoView(playState);
        let healthView = new HealthView(playState);

        uiViewContainer.addDynamicView(scoreView, { x: 100, y: 100, z: 0});
        uiViewContainer.addDynamicView(weaponView, { x: 250, y: 540, z: 0});
        uiViewContainer.addDynamicView(ammoView, { x: 10, y: 540, z: 0});
        uiViewContainer.addDynamicView(healthView, { x: 600, y: 540, z: 0});
        uiView.addViewContainer('main', uiViewContainer);
        uiView.currentViewContainer = 'main';

        return uiView;
    },

    playView (playState) {
        let playView = new PlayRenderView(playState);

        let playerView = new SoldierView(playState.player);
        let soldierView = new SoldierViewPool(playState.soldiers);
        let bulletSystemView = new BulletSystemView(playState.bulletSystem);
        let worldMapView = new WorldMapView(playState.map);

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
    }
};

export default ViewBuilder;
