let debug = require('debug')('game:engine/debug/render-debug');

let DebugStats = require('./statsjs');

let _rendererStats = function () {
    let msMin = 100;
    let msMax = 0;

    let container = document.createElement('div');

    container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

    let msDiv = document.createElement('div');

    msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#200;';
    container.appendChild(msDiv);

    let msText = document.createElement('div');

    msText.style.cssText = 'color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
    msText.innerHTML = 'WebGLRenderer';
    msDiv.appendChild(msText);

    let msTexts = [];
    let nLines = 9;

    for (let i = 0; i < nLines; i++) {
        msTexts[i] = document.createElement('div');
        msTexts[i].style.cssText = 'color:#f00;background-color:#311;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
        msDiv.appendChild(msTexts[i]);
        msTexts[i].innerHTML = '-';
    }

    let lastTime = Date.now();

    return {
        domElement: container,

        update: function (webGLRenderer) {
            // sanity check
            console.assert(webGLRenderer instanceof THREE.WebGLRenderer);

            // refresh only 30time per second
            if (Date.now() - lastTime < 1000 / 30) {
                return;
            }

            lastTime = Date.now();

            let i = 0;

            msTexts[i++].textContent = '== Memory =====';
            msTexts[i++].textContent = 'Programs: ' + webGLRenderer.info.programs.length;
            msTexts[i++].textContent = 'Geometries: ' + webGLRenderer.info.memory.geometries;
            msTexts[i++].textContent = 'Textures: ' + webGLRenderer.info.memory.textures;

            msTexts[i++].textContent = '== Render =====';
            msTexts[i++].textContent = 'Calls: ' + webGLRenderer.info.render.calls;
            msTexts[i++].textContent = 'Vertices: ' + webGLRenderer.info.render.vertices;
            msTexts[i++].textContent = 'Faces: ' + webGLRenderer.info.render.faces;
            msTexts[i++].textContent = 'Points: ' + webGLRenderer.info.render.points;
        }
    };
};

/**
 * provide info on THREE.WebGLRenderer
 *
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/

class RenderDebug {
    constructor (renderer) {
        this.renderer = renderer;

        this.statjs = new DebugStats();
        this.statjs.setModes([0, 1, 2]);

        // Stats.js
        this.statjs.domElement.style.position = 'absolute';
        this.statjs.domElement.style.left = '81px';
        this.statjs.domElement.style.bottom = '0px';

        document.body.appendChild(this.statjs.domElement);

        this.rendererStats = _rendererStats();

        // renderer-stats.js
        this.rendererStats.domElement.style.position = 'absolute';

        this.rendererStats.domElement.style.left = '0px';
        this.rendererStats.domElement.style.bottom = '0px';

        document.body.appendChild(this.rendererStats.domElement);
    }

    before () {
        this.statjs.begin();
    }

    after () {
        this.statjs.end();
        this.rendererStats.update(this.renderer);
    }
}

module.exports = RenderDebug;
