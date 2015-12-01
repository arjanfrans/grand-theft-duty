let debug = require('debug')('game:engine/logic/play/Stats');

let _sortByKills = function (characterA, characterB) {
    return characterA.kil - characterB.totalKills;
};

class Stats {
    constructor (playState) {
        this.state = playState;
        this.world = playState.world;
        this.player = this.state.player;
        this.soldiers = this.state.soldiers;
        this.visible = false;
    }

    teamStats () {
        let teams = new Map();

        for (let soldier of new Set([...this.soldiers, this.player])) {
            let team = teams.get(soldier.team);

            if (team) {
                team.kills += soldier.totalKills;
                team.deaths += soldier.totalDeaths;
                team.soldiers.push(soldier);
            } else {
                teams.set(soldier.team, {
                    kills: soldier.totalKills,
                    deaths: soldier.totalDeaths,
                    soldiers: [soldier]
                });
            }
        }

        for (let team of teams.values()) {
            team.soldiers.sort(_sortByKills);
        }

        return new Map([...teams.entries()].sort((teamA, teamB) => {
            return teamB[1].kills - teamA[1].kills;
        }));
    }
}

export default Stats;
