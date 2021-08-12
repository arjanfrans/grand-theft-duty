import { Engine } from "../engine/Engine";
import { SystemUpdateInterface } from "../engine/system/SystemUpdateInterface";

export abstract class AbstractState {
    protected readonly name: string;
    protected readonly engine: Engine;
    public readonly views: Set<any>;
    protected _initialized = false;

    protected systems: { system: SystemUpdateInterface; priority: number }[] =
        [];
    private orderedSystems: SystemUpdateInterface[] = [];

    protected constructor(name: string, engine: Engine) {
        this.name = name;
        this.engine = engine;
        this.views = new Set();
    }

    public addView(view: any): void {
        this.views.add(view);
    }

    public addSystem(system: SystemUpdateInterface, priority: number) {
        this.systems.push({
            system,
            priority,
        });

        this.orderSystems();
    }

    private orderSystems(): void {
        const systems = [...this.systems].sort((a, b) => {
            if (a.priority < b.priority) {
                return -1;
            } else if (a.priority > b.priority) {
                return 1;
            }
            return 0;
        });

        this.orderedSystems = systems.map(({ system }) => system);
    }

    public update(delta: number) {
        for (const system of this.orderedSystems) {
            if (!system.update(delta)) {
                break;
            }
        }
    }

    init() {
        if (!this._initialized) {
            for (const view of this.views.values()) {
                view.init();
            }

            this._initialized = true;
        }
    }

    render(delta) {
        for (const view of this.views.values()) {
            view.update(delta);
        }
    }
}
