/**
 * View that shows FPS, memory usage and render time.
 *
 * @returns {object} statsjs object
 */
const Stats = function () {
    const now = (self.performance && self.performance.now) ? self.performance.now.bind(performance) : Date.now;

    let startTime = now();
    let prevTime = startTime;
    let frames = 0;
    let modes = [0];

    const createElement = function (tag, id, css) {
        const element = document.createElement(tag);

        element.id = id;
        element.style.cssText = css;

        return element;
    };

    const createPanel = function (id, fg, bg) {
        const div = createElement('div', id, 'padding:0 0 3px 3px;text-align:left;background:' + bg);

        const text = createElement('div', id + 'Text', 'font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;color:' + fg);

        text.innerHTML = id.toUpperCase();
        div.appendChild(text);

        const graph = createElement('div', id + 'Graph', 'width:74px;height:30px;background:' + fg);

        div.appendChild(graph);

        for (let i = 0; i < 74; i++) {
            graph.appendChild(createElement('span', '', 'width:1px;height:30px;float:left;opacity:0.9;background:' + bg));
        }

        return div;
    };

    const setModes = function (values) {
        const children = container.children;

        for (let i = 0; i < children.length; i++) {
            if (values.indexOf(i) < 0) {
                children[i].style.display = 'none';
            } else {
                children[i].style.display = 'block';
            }
        }

        modes = values;
    };

    const setMode = function (value) {
        const children = container.children;

        for (let i = 0; i < children.length; i++) {
            children[i].style.display = i === value ? 'block' : 'none';
        }

        modes = [value];
    };

    const updateGraph = function (dom, value) {
        const child = dom.appendChild(dom.firstChild);

        child.style.height = Math.min(30, 30 - value * 30) + 'px';
    };

    const container = createElement('div', 'stats', 'width:80px;opacity:0.9;cursor:pointer');

    // FPS
    let fps = 0;
    let fpsMin = Number.POSITIVE_INFINITY;
    let fpsMax = 0;

    const fpsDiv = createPanel('fps', '#0ff', '#002');
    const fpsText = fpsDiv.children[0];
    const fpsGraph = fpsDiv.children[1];

    container.appendChild(fpsDiv);

    // MS
    let ms = 0;
    let msMin = Number.POSITIVE_INFINITY;
    let msMax = 0;

    const msDiv = createPanel('ms', '#0f0', '#020');
    const msText = msDiv.children[0];
    const msGraph = msDiv.children[1];

    container.appendChild(msDiv);

    let mem = 0;
    let memMin = Number.POSITIVE_INFINITY;
    let memMax = 0;
    const memDiv = createPanel('mb', '#f08', '#201');
    const memText = memDiv.children[0];
    const memGraph = memDiv.children[1];

    // MEM
    if (self.performance && self.performance.memory) {
        container.appendChild(memDiv);
    }

    setModes([modes]);

    return {
        REVISION: 14,
        domElement: container,
        setMode: setMode,
        setModes: setModes,
        begin: function () {
            startTime = now();
        },
        end: function () {
            const time = now();

            ms = time - startTime;
            msMin = Math.min(msMin, ms);
            msMax = Math.max(msMax, ms);

            msText.textContent = (ms | 0) + ' MS (' + (msMin | 0) + '-' + (msMax | 0) + ')';
            updateGraph(msGraph, ms / 200);

            frames++;

            if (time > prevTime + 1000) {
                fps = Math.round((frames * 1000) / (time - prevTime));
                fpsMin = Math.min(fpsMin, fps);
                fpsMax = Math.max(fpsMax, fps);

                fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
                updateGraph(fpsGraph, fps / 100);

                prevTime = time;
                frames = 0;

                if (typeof mem !== 'undefined' && performance && performance.memory) {
                    const heapSize = performance.memory.usedJSHeapSize;
                    const heapSizeLimit = performance.memory.jsHeapSizeLimit;

                    mem = Math.round(heapSize * 0.000000954);
                    memMin = Math.min(memMin, mem);
                    memMax = Math.max(memMax, mem);

                    memText.textContent = mem + ' MB (' + memMin + '-' + memMax + ')';
                    updateGraph(memGraph, heapSize / heapSizeLimit);
                }
            }

            return time;
        },

        update: function () {
            startTime = this.end();
        }
    };
};

export default Stats;
