import { SoldierComponent } from "../../components/SoldierComponent";
import { EntityManager } from "../EntityManager";
import { Entity } from "../Entity";

export class SoldierQuery {
    private constructor() {}

    public static getSoldierEntities(em: EntityManager): Entity[] {
        return em.getEntitiesWithTypes([SoldierComponent.TYPE]);
    }

    public static getSoldierScores(em: EntityManager) {
        const teams = new Map();

        for (const entity of SoldierQuery.getSoldierEntities(em)) {
            const soldier = entity.getComponent<SoldierComponent>(
                SoldierComponent.TYPE
            );
            const team = teams.get(soldier.teamName);

            if (team) {
                team.kills += soldier.totalKills;
                team.deaths += soldier.totalDeaths;
                team.soldiers.push(soldier);
            } else {
                teams.set(soldier.teamName, {
                    kills: soldier.totalKills,
                    deaths: soldier.totalDeaths,
                    soldiers: [soldier],
                });
            }
        }

        for (const team of teams.values()) {
            team.soldiers.sort((a, b) => b.kills - a.kills);
        }

        return new Map(
            [...teams.entries()].sort((teamA, teamB) => {
                return teamB[1].kills - teamA[1].kills;
            })
        );
    }
}
