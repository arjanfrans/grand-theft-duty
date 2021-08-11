const util = require('util');
const exec = util.promisify(require('child_process').exec);
import * as fs from 'fs/promises';
var Mustache = require('mustache');
var os = require('os');
var path = require('path');

var packing = require('./packing/packing.js');
var sorter = require('./sorter.js');

export async function extrudeImages(files, options) {
    if (options.extrude === 0) {
        return null;
    }

    const extrude = options.extrude;

    for (const file of files) {
        const offset = (options.extrude * 2);
        const command = `convert ${file.path} -define png:exclude-chunks=date -set option:distort:viewport ${file.width-offset}x${file.height-offset}-${extrude}-${extrude} -virtual-pixel Edge -filter point -distort SRT 0 +repage ${file.path}`

        await exec(command);
    }
}

export async function copyFiles(files) {
    const result = [];

    let i = 0;

    const tmpDir = path.join(os.tmpdir(), 'spritesheet_tmp');

    for (const file of files) {
        const newFile = {
            ...file,
            originalPath: file.path,
            path: path.join(tmpDir, + (new Date()).getTime()+'image_' + i + '.png')
        };

        i++;

        await fs.mkdir(tmpDir, {recursive: true});
        await fs.copyFile(newFile.originalPath, newFile.path);

        result.push(newFile);
    }

    return result;
}

/**
 * Iterates through given files and gets its size
 * @param {string[]} files
 * @param {object} options
 * @param {boolean} options.trim is trimming enabled
 */
export async function getImagesSizes(files, options) {
    var filePaths = files.map(function (file) {
        return '"' + file.path + '"';
    });

    const {stdout} = await exec('identify ' + filePaths.join(' '));

    var sizes = stdout.split('\n');
    sizes = sizes.splice(0, sizes.length - 1);
    sizes.forEach(function (item, i) {
        var size = item.match(/ ([0-9]+)x([0-9]+) /);
        const offset = (options.padding * 2 + options.extrude * 2);

        files[i].width = parseInt(size[1], 10) + offset;
        files[i].height = parseInt(size[2], 10) + offset;
        files[i].area = files[i].width * files[i].height;
        files[i].trimmed = false;

        if (options.trim) {
            var rect = item.match(/ ([0-9]+)x([0-9]+)[\+\-]([0-9]+)[\+\-]([0-9]+) /);
            files[i].trim = {};
            files[i].trim.x = parseInt(rect[3], 10) - 1;
            files[i].trim.y = parseInt(rect[4], 10) - 1;
            files[i].trim.width = parseInt(rect[1], 10) - 2;
            files[i].trim.height = parseInt(rect[2], 10) - 2;

            files[i].trimmed = (files[i].trim.width !== files[i].width - offset || files[i].trim.height !== files[i].height - offset);
        }
    });

    return files;
}

/**
 * Determines texture size using selected algorithm
 * @param {object[]} files
 * @param {object} options
 * @param {object} options.algorithm (growing-binpacking, binpacking, vertical, horizontal)
 * @param {object} options.square canvas width and height should be equal
 * @param {object} options.powerOfTwo canvas width and height should be power of two
 */
export function determineCanvasSize(files, options) {
    files.forEach(function (item) {
        item.w = item.width;
        item.h = item.height;
    });

    // sort files based on the choosen options.sort method
    sorter.run(options.sort, files);

    packing.pack(options.algorithm, files, options);

    if (options.square) {
        options.width = options.height = Math.max(options.width, options.height);
    }

    if (options.powerOfTwo) {
        options.width = roundToPowerOfTwo(options.width);
        options.height = roundToPowerOfTwo(options.height);
    }

    return options;
}

/**
 * generates texture data file
 * @param {object[]} files
 * @param {object} options
 * @param {string} options.path path to image file
 */
export async function generateImage(files, options) {
    const command = ['convert -define png:exclude-chunks=date -quality 0% -size ' + options.width + 'x' + options.height + ' xc:none'];

    for (const file of files) {
        command.push('"' + file.path + '" -geometry +' + (file.x + options.padding) + '+' + (file.y + options.padding) + ' -composite');
    }

    command.push('"' + options.path + '/' + options.name + '.png"');

    await exec(command.join(' '));
}

export async function clearTempFiles(files) {
    for (const file of files) {
        await fs.unlink(file.path);
    }
}

/**
 * generates texture data file
 * @param {object[]} files
 * @param {object} options
 * @param {string} options.path path to data file
 * @param {string} options.dataFile data file name
 */
export async function generateData(files, options) {
    var formats = (Array.isArray(options.customFormat) ? options.customFormat : [options.customFormat]).concat(Array.isArray(options.format) ? options.format : [options.format]);

    for (const format of formats) {
        const i = formats.indexOf(format);

        if (!format) continue;

        var path = typeof format === 'string' ? format : __dirname + '/templates/' + format.template;
        var templateContent = await fs.readFile(path, 'utf-8');

        // sort files based on the choosen options.sort method
        sorter.run(options.sort, files);

        options.files = files;
        options.files[options.files.length - 1].isLast = true;
        options.files.forEach(function (item, i) {
            const offset = (options.padding * 2 + options.extrude * 2);

            item.width -= offset;
            item.height -= offset;
            item.x += options.padding + options.extrude;
            item.y += options.padding + options.extrude;

            item.index = i;
            if (item.trim) {
                item.trim.frameX = -item.trim.x;
                item.trim.frameY = -item.trim.y;
                item.trim.offsetX = Math.floor(Math.abs(item.trim.x + item.width / 2 - item.trim.width / 2));
                item.trim.offsetY = Math.floor(Math.abs(item.trim.y + item.height / 2 - item.trim.height / 2));
            }
            item.cssName = item.name || "";
            item.cssName = item.cssName.replace("_hover", ":hover");
            item.cssName = item.cssName.replace("_active", ":active");
        });

        var result = Mustache.render(templateContent, options);

        function findPriority(property) {
            var value = options[property];
            var isArray = Array.isArray(value);
            if (isArray) {
                return i < value.length ? value[i] : format[property] || value[0];
            }
            return format[property] || value;
        }

        await fs.writeFile(findPriority('path') + '/' + findPriority('name') + '.' + findPriority('extension'), result);
    }
}

/**
 * Rounds a given number to to next number which is power of two
 * @param {number} value number to be rounded
 * @return {number} rounded number
 */
function roundToPowerOfTwo(value) {
    var powers = 2;
    while (value > powers) {
        powers *= 2;
    }

    return powers;
}
