import BulletSystemView from './BulletSystemView';
import StaticBlocksView from './StaticBlocksView';
import TextView from './TextView';
import WaterBlocksView from './WaterBlocksView';
import WorldMapView from './WorldMapView';

let View = {
    BulletSystem: BulletSystemView,
    StaticBlocks: StaticBlocksView,
    WaterBlocks: WaterBlocksView,
    WorldMap: WorldMapView,
    Text: TextView
};

export default View;
