import {ComponentInterface} from "./ComponentInterface";

export class SoldierComponent implements ComponentInterface {
    public static TYPE: string = 'SoldierComponent';

    // Contains the character killed, and the count
    public readonly kills: Map<SoldierComponent, number> = new Map();

    // Contains the characters killed by, and the count
    public readonly deaths: Map<SoldierComponent, number> = new Map();

    public readonly maxHealth: number = 100;
    public health: number = 100;

    kill() {
        const suicides = this.deaths.get(this);

        if (suicides) {
            this.deaths.set(this, suicides + 1);
        } else {
            this.deaths.set(this, 1);
        }
    }

    get totalKills() {
        let total = 0;

        for (const kill of this.kills.values()) {
            total += kill;
        }

        return total;
    }

    get totalDeaths() {
        let total = 0;

        for (const death of this.deaths.values()) {
            total += death;
        }

        return total;
    }

    get type(): string
    {
        return SoldierComponent.TYPE;
    }
}
