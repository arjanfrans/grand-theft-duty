import { Mesh, MeshLambertMaterial, Object3D, PlaneGeometry } from "three";
import { TextView } from "../engine/graphics/TextView";
import { View } from "../engine/graphics/View";
import { PlayState } from "../state/PlayState";
import { SoldierQuery } from "../ecs/entities/queries/SoldierQuery";

function converToText(teams) {
    let resultText = "";

    for (const [teamName, teamData] of teams.entries()) {
        resultText += `${teamName} - k: ${teamData.kills} - d: ${teamData.deaths} \n`;

        const soldierText: string[] = [];

        for (const soldier of teamData.soldiers) {
            const text = `${soldier.name} - k: ${soldier.totalKills} - d: ${soldier.totalDeaths}`;

            soldierText.push(text);
        }

        resultText += soldierText.join("\n");
        resultText += "\n----------------------\n";
    }

    return resultText;
}

export class ScoreView extends View {
    private state: PlayState;
    private textView?: TextView = undefined;

    constructor(state: PlayState) {
        super();

        this.state = state;
    }

    init() {
        const mesh = new Object3D();

        const backgroundMaterial = new MeshLambertMaterial({
            color: 0x00000,
            transparent: true,
            opacity: 0.5,
        });

        const backgroundGeometry = new PlaneGeometry(600, 800);

        mesh.add(new Mesh(backgroundGeometry, backgroundMaterial));

        const textView = new TextView("", {
            color: 0xfeff80,
            width: 600,
            align: "left",
        });

        textView.init();

        mesh.visible = false;

        const textViewMesh = textView.mesh as Object3D;

        mesh.add(textViewMesh);

        this.mesh = mesh;
        this.textView = textView;

        super.init();
    }

    update() {
        const mesh = this.mesh as Mesh;

        if (this.state.showScores) {
            if (!mesh.visible) {
                mesh.visible = true;
            }

            const textView = this.textView as TextView;

            // Scores have changed
            textView.text = converToText(
                SoldierQuery.getSoldierScores(this.state.em)
            );
        } else if (mesh.visible) {
            mesh.visible = false;
        }
    }
}
