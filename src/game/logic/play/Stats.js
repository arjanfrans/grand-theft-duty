let debug = require('debug')('game:engine/logic/play/Stats');

let _sortByKills = function (characterA, characterB) {
    return characterA.kil - characterB.totalKills;
};

class Stats {
    constructor (playState) {
        this.state = playState;
        this.world = playState.world;
        this.player = this.state.world.player;
        this.characters = this.state.world.characters;

        this.visible = false;
    }

    teamStats () {
        let teams = new Map();

        for (let character of new Set([...this.characters, this.player])) {
            let team = teams.get(character.team);

            if (team) {
                team.kills += character.totalKills;
                team.deaths += character.totalDeaths;
                team.soldiers.push(character);
            } else {
                teams.set(character.team, {
                    kills: character.totalKills,
                    deaths: character.totalDeaths,
                    soldiers: [character]
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
