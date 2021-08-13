import {AbstractState} from "../engine/state/AbstractState";
import {Engine} from "../engine/Engine";
import {EntityManager} from "../ecs/EntityManager";
import {SystemInterface} from "../ecs/systems/SystemInterface";
import {MovementSystem} from "../ecs/systems/MovementSystem";
import {CollisionSystem} from "../ecs/systems/CollisionSystem";
import WorldMap from "../core/maps/WorldMap";
import {ComputerControllableSystem} from "../ecs/systems/ComputerControllableSystem";
import {PlayerControllableSystem} from "../ecs/systems/PlayerControllableSystem";
import {WeaponSystem} from "../ecs/systems/WeaponSystem";
import {BulletSystem} from "../ecs/systems/BulletSystem";
import {Entity} from "../ecs/Entity";
import {PlayerControllableComponent} from "../ecs/components/PlayerControllableComponent";
import {SoldierComponent} from "../ecs/components/SoldierComponent";

export class PlayState extends AbstractState {
    public readonly em: EntityManager = new EntityManager();
    private readonly systems: SystemInterface[] = [];
    public readonly map: WorldMap;

    constructor(engine: Engine, map: WorldMap) {
        super("play", engine);

        this.systems.push(new PlayerControllableSystem(this.em, engine.inputSources));
        this.systems.push(new ComputerControllableSystem(this.em));
        this.systems.push(new MovementSystem(this.em));
        this.systems.push(new CollisionSystem(this.em, map));
        this.systems.push(new WeaponSystem(this.em));
        this.systems.push(new BulletSystem(this.em));

        this.map = map;
    }

    update(delta: number): void {
        for (const system of this.systems) {
            system.update(delta);
        }
    }

    getPlayerEntity(): Entity
    {
        const entities = this.em.getEntitiesWithTypes([
            PlayerControllableComponent.TYPE,
            SoldierComponent.TYPE
        ]);

        if (entities.length !== 1) {
            throw new Error('No player entity found');
        }

        return entities[0];
    }
}
