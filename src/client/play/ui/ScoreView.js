import { Mesh, MeshLambertMaterial, Object3D, PlaneGeometry } from 'three';
import { TextView, View } from '../../../engine/graphics';

function converToText (teams) {
    let resultText = '';

    for (const [teamName, teamData] of teams.entries()) {
        resultText += `${teamName} - k: ${teamData.kills} - d: ${teamData.deaths} \n`;

        const soldierText = [];

        for (const soldier of teamData.soldiers) {
            const text = `${soldier.name} - k: ${soldier.totalKills} - d: ${soldier.totalDeaths}`;

            soldierText.push(text);
        }

        resultText += soldierText.join('\n');
        resultText += '\n----------------------\n';
    }

    return resultText;
}

class ScoreView extends View {
    constructor (state) {
        super();

        this.state = state;
        this.match = state.match;
    }

    init () {
        this.mesh = new Object3D();

        const backgroundMaterial = new MeshLambertMaterial({
            color: 0x00000,
            transparent: true,
            opacity: 0.5
        });

        const backgroundGeometry = new PlaneGeometry(600, 800);

        this.mesh.add(new Mesh(backgroundGeometry, backgroundMaterial));

        this.scoreTextView = new TextView(this._scoreText, {
            color: 0xfeff80,
            width: 600,
            align: 'left'
        });

        this.scoreTextView.init();

        this.mesh.visible = false;
        this.mesh.add(this.scoreTextView.mesh);

        super.init();
    }

    update () {
        if (this.state.showScores) {
            if (!this.mesh.visible) {
                this.mesh.visible = true;
            }

            const newScores = converToText(this.match.sortedScores());

            // Scores have changed
            this.scoreTextView.text = newScores;
        } else if (this.mesh.visible) {
            this.mesh.visible = false;
        }
    }
}

export default ScoreView;
