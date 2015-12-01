let soldierStatsByTeam = function (stat) {
    let resultsByTeam = new Map();

    for (let [teamName, soldiers] of this.teams.entries()) {
        for (let soldier of soldiers) {
            let teamResult = resultsByTeam.get(teamName);

            if (teamResult) {
                resultsByTeam.set(teamName, teamResult + soldier[stat]);
            } else {
                resultsByTeam.set(teamName, soldier[stat]);
            }
        }
    }
};

class Match {
    constructor (teams) {
        this.matchTime = 0;
        this.matchDuration = 300000;
        this.soldiers = new Set();
        this.teamNames = [];
        this.teams = new Map();

        for (let teamName of teams) {
            this.teamNames.push(teamName);
            this.teams.set(teamName, new Set());
        }
    }

    teamWithLeastPlayers () {
        let leastTeamName = null;
        let minCount = Number.MAX_VALUE;

        for (let teamName of this.teamNames) {
            let count = this.teams.get(teamName).size;

            if (count < minCount) {
                leastTeamName = teamName;
                minCount = count;
            }
        }

        return leastTeamName;
    }

    addSoldier (soldier, teamName) {
        if (!teamName) {
            teamName = this.teamWithLeastPlayers();
        }

        // FIXME get this out of here?
        soldier.team = teamName;

        let team = this.teams.get(teamName);

        if (team) {
            team.add(soldier);
            this.soldiers.add(soldier);

            return true;
        }

        return false;
    }

    removeSoldier (soldier) {
        for (let team of this.teams) {
            if (team.has(solider)) {
                team.delete(soldier);

                return true;
            }
        }

        return false;
    }

    killsByTeam () {
        return soldierStatsByTeam('kills');
    }

    deathsByTeam () {
        return soldierStatsByTeam('deaths');
    }

    start () {

    }

    end () {

    }

    update (delta) {
        this.matchTime += delta;

        if (this.matchTime >= this.matchDuration) {
            this.end();
        }
    }
}

export default Match;
