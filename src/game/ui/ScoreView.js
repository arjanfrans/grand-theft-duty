let debug = require('debug')('game:game/ui/ScoreView');

import View from '../../engine/views/View';
import TextView from '../../engine/views/TextView';

let _converToText = function (teams) {
    let resultText = '';

    for (let [teamName, teamData] of teams.entries()) {
        resultText += `${teamName} - k: ${teamData.kills} - d: ${teamData.deaths} \n`;

        let soldierText = [];

        for (let soldier of teamData.soldiers) {
            let text = `${soldier.name} - k: ${soldier.totalKills} - d: ${soldier.totalDeaths}`;

            soldierText.push(text);
        }

        resultText += soldierText.join('\n');
        resultText += '\n----------------------\n';
    }

    return resultText;
};

class ScoreView extends View {
    constructor () {
        super();

        this._scoreText = '@@';
    }

    init () {
        this.mesh = new THREE.Object3D();

        let backgroundMaterial = new THREE.MeshLambertMaterial({
            color: 0x00000,
            transparent: true,
            opacity: 0.5
        });

        let backgroundGeometry = new THREE.PlaneGeometry(550, 600);

        this.mesh.add(new THREE.Mesh(backgroundGeometry, backgroundMaterial));

        this.scoreTextView = new TextView(this._scoreText, {
            color: 0xfeff80,
            width: 500,
            align: 'left'
        });

        this.scoreTextView.init();

        this.mesh.visible = false;
        this.mesh.add(this.scoreTextView.mesh);

        this._initialized = true;
    }

    updateStats (stats) {
        if (stats.visible) {
            if (!this.mesh.visible) {
                this.mesh.visible = true;
            }

            let newScores = _converToText(stats.teamStats());

            // Scores have changed
            this.scoreTextView.text = newScores;
        } else {
            if (this.mesh.visible) {
                this.mesh.visible = false;
            }
        }
    }
}

export default ScoreView;
