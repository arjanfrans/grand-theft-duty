import ServerState from './ServerState';
import MapParser from '../core/maps/MapParser';
import Match from '../core/Match';
import CollisionSystem from '../core/CollisionSystem';
import BulletSystem from '../core/BulletSystem';

import AssetManager from './ServerAssetManager';

let ServerStateBuilder = {
    create (engine, options) {
        AssetManager.init();

        let map = MapParser.parse(AssetManager.getMap(options.map));
        let match = new Match(options.teams);
        let serverState = new ServerState(match, map);

        let collisionSystem = new CollisionSystem(serverState);
        let bulletSystem = new BulletSystem(serverState, {
            poolLimit: options.poolLimit || 200
        });

        serverState.bulletSystem = bulletSystem;
        serverState.collisionSystem = collisionSystem;

        return serverState;
    }
};

export default ServerStateBuilder;
