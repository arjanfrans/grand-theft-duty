/**
 * Get a given statistic of a all soldiers per team.
 *
 * @param {string} stat Stat to get.
 *
 * @return {Map} Stats per team
 */
import { Soldier } from "./entities/Soldier";

export class Match {
    private matchTime: number = 0;
    private matchDuration: number = 300000;
    public readonly soldiers: Set<Soldier> = new Set<Soldier>();
    private teamNames: string[] = [];
    private teams: Map<string, Set<Soldier>> = new Map();

    constructor(teams: string[]) {
        for (const teamName of teams) {
            this.teamNames.push(teamName);
            this.teams.set(teamName, new Set());
        }
    }

    teamWithLeastPlayers() {
        let leastTeamName: string | undefined = undefined;
        let minCount = Number.MAX_VALUE;

        for (const teamName of this.teamNames) {
            const team = this.teams.get(teamName) as Set<Soldier>;
            const count = team.size;

            if (count < minCount) {
                leastTeamName = teamName;
                minCount = count;
            }
        }

        return leastTeamName;
    }

    addSoldier(soldier, teamName) {
        if (!teamName) {
            teamName = this.teamWithLeastPlayers();
        }

        // FIXME get this out of here?
        soldier.team = teamName;

        const team = this.teams.get(teamName);

        if (team) {
            team.add(soldier);
            this.soldiers.add(soldier);

            return true;
        }

        return false;
    }

    sortedScores() {
        const teams = new Map();

        for (const soldier of new Set([...this.soldiers])) {
            const team = teams.get(soldier.team);

            if (team) {
                team.kills += soldier.totalKills;
                team.deaths += soldier.totalDeaths;
                team.soldiers.push(soldier);
            } else {
                teams.set(soldier.team, {
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

    removeSoldier(soldier) {
        for (const team of this.teams.values()) {
            if (team.has(soldier)) {
                team.delete(soldier);

                return true;
            }
        }

        return false;
    }

    killsByTeam() {
        return this.soldierStatsByTeam("kills");
    }

    deathsByTeam() {
        return this.soldierStatsByTeam("deaths");
    }
    private soldierStatsByTeam(stat) {
        const resultsByTeam = new Map();

        for (let [teamName, soldiers] of this.teams.entries()) {
            for (const soldier of soldiers) {
                const teamResult = resultsByTeam.get(teamName);

                if (teamResult) {
                    resultsByTeam.set(teamName, teamResult + soldier[stat]);
                } else {
                    resultsByTeam.set(teamName, soldier[stat]);
                }
            }
        }
    }

    start() {}

    end() {}

    update(delta): void {
        this.matchTime += delta;

        if (this.matchTime >= this.matchDuration) {
            this.end();
        }
    }
}
