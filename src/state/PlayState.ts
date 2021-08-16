import { AbstractState } from "../engine/state/AbstractState";
import { Engine } from "../engine/Engine";
import { EntityManager } from "../ecs/entities/EntityManager";
import { SystemInterface } from "../ecs/systems/SystemInterface";
import { MovementSystem } from "../ecs/systems/MovementSystem";
import { CollisionSystem } from "../ecs/systems/CollisionSystem";
import WorldMap from "../core/maps/WorldMap";
import { ComputerControllableSystem } from "../ecs/systems/ComputerControllableSystem";
import { PlayerControllableSystem } from "../ecs/systems/PlayerControllableSystem";
import { WeaponSystem } from "../ecs/systems/WeaponSystem";
import { BulletSystem } from "../ecs/systems/BulletSystem";
import { MatchSystem } from "../ecs/systems/MatchSystem";

export class PlayState extends AbstractState {
    public readonly em: EntityManager = new EntityManager();
    private readonly systems: SystemInterface[] = [];
    public readonly map: WorldMap;
    public showScores: boolean = false;
    public isPaused: boolean = false;

    constructor(engine: Engine, map: WorldMap) {
        super("play", engine);

        this.systems.push(
            new PlayerControllableSystem(this, engine.inputSources)
        );
        this.systems.push(new ComputerControllableSystem(this.em));
        this.systems.push(new MovementSystem(this.em));
        this.systems.push(new CollisionSystem(this.em, map));
        this.systems.push(new WeaponSystem(this.em));
        this.systems.push(new BulletSystem(this.em));
        this.systems.push(new MatchSystem(this.em));

        this.map = map;
    }

    update(delta: number): void {
        for (const system of this.systems) {
            if (system instanceof PlayerControllableSystem) {
                system.update(delta);
            } else if (!this.isPaused) {
                system.update(delta);
            }
        }
    }
}
