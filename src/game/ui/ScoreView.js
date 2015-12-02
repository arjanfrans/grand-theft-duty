import View from '../../engine/views/View';
import Views from '../../engine/views';

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

        // FIXME atm three.js doesn't allow growing of buffers, so prefix it
        this.bufferFill = false;
    }

    init () {
        this.mesh = new THREE.Object3D();

        let backgroundMaterial = new THREE.MeshLambertMaterial({
            color: 0x00000,
            transparent: true,
            opacity: 0.5
        });

        let backgroundGeometry = new THREE.PlaneGeometry(600, 800);

        this.mesh.add(new THREE.Mesh(backgroundGeometry, backgroundMaterial));

        this.scoreTextView = new Views.Text(this._scoreText, {
            color: 0xfeff80,
            width: 600,
            align: 'left'
        });

        this.scoreTextView.init();

        this.mesh.visible = true;
        this.mesh.add(this.scoreTextView.mesh);

        this._initialized = true;
    }

    updateStats (match, showScores) {
        if (!this.bufferFill) {
            this.scoreTextView.text = '1'.repeat(1000);
            this.bufferFill = true;
        } else {
            if (showScores) {
                if (!this.mesh.visible) {
                    this.mesh.visible = true;
                }

                let newScores = _converToText(match.sortedScores());

                // Scores have changed
                this.scoreTextView.text = newScores;
            } else {
                if (this.mesh.visible) {
                    this.mesh.visible = false;
                }
            }
        }
    }
}

export default ScoreView;
