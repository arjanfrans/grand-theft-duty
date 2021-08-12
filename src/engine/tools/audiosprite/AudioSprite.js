import * as fs from "fs/promises";
import {createWriteStream, createReadStream} from "fs";
import * as path from "path";
import * as _ from "underscore"

const defaults = {
    output: 'output',
    path: '',
    export: 'ogg,m4a,mp3,ac3',
    format: null,
    autoplay: null,
    loop: [],
    silence: 0,
    gap: 1,
    minlength: 0,
    bitrate: 128,
    vbr: -1,
    'vbr:vorbis': -1,
    samplerate: 44100,
    channels: 1,
    rawparts: '',
    ignorerounding: 0,
}

export async function AudioSprite(files, opts) {
    if (!files || !files.length) {
        throw new Error('No input files specified.');
    }

    function mktemp(prefix) {
        const tmpdir = require('os').tmpdir() || '.';
        return path.join(tmpdir, prefix + '.' + Math.random().toString().substr(2));
    }

    function spawn(name, opt) {
        console.debug('Spawn', {cmd: [name].concat(opt).join(' ')});
        return require('child_process').spawn(name, opt);
    }

    function pad(num, size) {
        let str = num.toString();

        while (str.length < size) {
            str = '0' + str;
        }

        return str;
    }

    async function makeRawAudioFile(src) {
        return new Promise(async (resolve, reject) => {
            const dest = mktemp('audiosprite')

            console.debug('Start processing', {file: src})

            const exists = await fs.access(src) === undefined;

            if (exists) {
                let code = -1
                let signal = undefined
                let ffmpeg = spawn('ffmpeg', ['-i', path.resolve(src)]
                    .concat(wavArgs).concat('pipe:'))
                let streamFinished = _.after(2,  () => {
                    if (code) {
                        console.dir({
                            msg: 'File could not be added',
                            file: src,
                            retcode: code,
                            signal: signal
                        })

                        return reject(new Error('File could not be addde'));
                    }

                    return resolve(dest);
                });

                let writeStream = createWriteStream(dest, {flags: 'w'})

                ffmpeg.stdout.pipe(writeStream)
                writeStream.on('close', streamFinished)

                ffmpeg.on('close',  (_code, _signal) => {
                    code = _code
                    signal = _signal
                    streamFinished()
                })
            } else {
                reject(new Error(`File does not exists: ${src}`))
            }
        })
    }

    async function appendFile(name, src, dest) {
        let size = 0;
        const reader = createReadStream(src);
        const writer = createWriteStream(dest, {
            flags: 'a'
        });

        return new Promise((resolve, reject) => {
            reader.on('data', function (data) {
                size += data.length
            })

            reader.on('error', (err) => {
                reject(err);
            })

            reader.on('close', async () => {
                const originalDuration = size / opts.samplerate / opts.channels / 2;

                console.info('File added OK', {file: src, duration: originalDuration})

                let extraDuration = Math.max(0, opts.minlength - originalDuration);

                const duration = originalDuration + extraDuration;

                json.spritemap[name] = {
                    start: offsetCursor
                    , end: offsetCursor + duration
                    , loop: name === opts.autoplay || opts.loop.indexOf(name) !== -1
                }
                offsetCursor += originalDuration

                let delta = Math.ceil(duration) - duration;

                if (opts.ignorerounding) {
                    console.info('Ignoring nearest second silence gap rounding');
                    extraDuration = 0;
                    delta = 0;
                }

                await appendSilence(extraDuration + delta + opts.gap, dest)
                resolve();
            })

            reader.pipe(writer)
        });
    }

    async function appendSilence(duration, dest) {
        return new Promise((resolve, reject) => {
            const buffer = new Buffer(Math.round(opts.samplerate * 2 * opts.channels * duration))

            buffer.fill(0)

            const writeStream = createWriteStream(dest, {flags: 'a'})

            writeStream.end(buffer)

            writeStream.on('error', (err) => {
                reject(err);
            })

            writeStream.on('close', () => {
                console.info('Silence gap added', {duration: duration})
                offsetCursor += duration
                resolve()
            })
        })
    }

    async function exportFile(src, dest, ext, opt, store) {
        const outfile = dest + '.' + ext;

        return new Promise((resolve, reject) => {
            spawn('ffmpeg', ['-y', '-ar', opts.samplerate, '-ac', opts.channels, '-f', 's16le', '-i', src]
                .concat(opt).concat(outfile))
                .on('exit', function (code, signal) {
                    if (code) {
                        return reject({
                            msg: 'Error exporting file',
                            format: ext,
                            retcode: code,
                            signal: signal
                        })
                    }

                    console.info('Exported ' + ext + ' OK', {file: outfile})

                    if (store) {
                        json.resources.push(outfile)
                    }
                    resolve()
                })
        })
    }

    async function processFiles() {
        let formats = {
            aiff: []
            , wav: []
            , ac3: ['-acodec', 'ac3', '-ab', opts.bitrate + 'k']
            , mp3: ['-ar', opts.samplerate, '-f', 'mp3']
            , mp4: ['-ab', opts.bitrate + 'k']
            , m4a: ['-ab', opts.bitrate + 'k', '-strict', '-2']
            , ogg: ['-acodec', 'libvorbis', '-f', 'ogg', '-ab', opts.bitrate + 'k']
            , opus: ['-acodec', 'libopus', '-ab', opts.bitrate + 'k']
            , webm: ['-acodec', 'libvorbis', '-f', 'webm', '-dash', '1']
        };

        if (opts.vbr >= 0 && opts.vbr <= 9) {
            formats.mp3 = formats.mp3.concat(['-aq', opts.vbr])
        } else {
            formats.mp3 = formats.mp3.concat(['-ab', opts.bitrate + 'k'])
        }

        // change quality of webm output - https://trac.ffmpeg.org/wiki/TheoraVorbisEncodingGuide
        if (opts['vbr:vorbis'] >= 0 && opts['vbr:vorbis'] <= 10) {
            formats.webm = formats.webm.concat(['-qscale:a', opts['vbr:vorbis']])
        } else {
            formats.webm = formats.webm.concat(['-ab', opts.bitrate + 'k'])
        }

        if (opts.export.length) {
            formats = opts.export.split(',').reduce(function (memo, val) {
                if (formats[val]) {
                    memo[val] = formats[val]
                }
                return memo
            }, {})
        }

        const rawparts = opts.rawparts.length ? opts.rawparts.split(',') : null;
        let i = 0;
        console.info(files);
        for (const file of files) {
            i++

            const tmp = await makeRawAudioFile(file);

            const name = path.basename(file).replace(/\.[a-zA-Z0-9]+$/, '');

            await appendFile(name, tmp, tempFile);

            if (rawparts != null ? rawparts.length : void 0) {
                for (const ext of rawparts) {
                    console.debug('Start export slice', {name: name, format: ext, i: i})
                    await exportFile(tmp, opts.output + '_' + pad(i, 3), ext, formats[ext]
                        , false)

                    await fs.unlink(tmp)
                }
            } else {
                await fs.unlink(tmp)
            }
        }

        for (const ext of Object.keys(formats)) {
            console.debug('Start export', {format: ext})

            await exportFile(tempFile, opts.output, ext, formats[ext], true)
        }

        if (opts.autoplay) {
            json.autoplay = opts.autoplay
        }

        json.resources = json.resources.map(function (e) {
            return opts.path ? path.join(opts.path, path.basename(e)) : e
        })

        let finalJson = {};

        switch (opts.format) {

            case 'howler':
            case 'howler2':
                finalJson[opts.format === 'howler' ? 'urls' : 'src'] = [].concat(json.resources)
                finalJson.sprite = {}
                for (let sn in json.spritemap) {
                    let spriteInfo = json.spritemap[sn]
                    finalJson.sprite[sn] = [spriteInfo.start * 1000, (spriteInfo.end - spriteInfo.start) * 1000]
                    if (spriteInfo.loop) {
                        finalJson.sprite[sn].push(true)
                    }
                }
                break

            case 'createjs':
                finalJson.src = json.resources[0]
                finalJson.data = {audioSprite: []}
                for (let sn in json.spritemap) {
                    let spriteInfo = json.spritemap[sn]
                    finalJson.data.audioSprite.push({
                        id: sn,
                        startTime: spriteInfo.start * 1000,
                        duration: (spriteInfo.end - spriteInfo.start) * 1000
                    })
                }
                break

            case 'default':
            default:
                finalJson = json
                break
        }

        await fs.unlink(tempFile)

        const jsonfile = opts.output + '.json'

        await fs.writeFile(jsonfile, JSON.stringify(finalJson, null, 2))
    }

    opts = Object.assign({}, defaults, opts);

    let offsetCursor = 0
    const wavArgs = ['-ar', opts.samplerate, '-ac', opts.channels, '-f', 's16le']
    const tempFile = mktemp('audiosprite')

    console.debug('Created temporary file', {file: tempFile})

    const json = {
        resources: []
        , spritemap: {}
    }

    return new Promise((resolve, reject) => {
        spawn('ffmpeg', ['-version']).on('exit', async (code) => {
            if (code) {
                return reject(new Error('ffmpeg was not found on your path'));
            }

            if (opts.silence) {
                json.spritemap.silence = {
                    start: 0
                    , end: opts.silence
                    , loop: true
                }

                if (!opts.autoplay) {
                    json.autoplay = 'silence'
                }

                await appendSilence(opts.silence + opts.gap, tempFile)
                await processFiles();
            } else {
                await processFiles()
            }

            resolve();
        })
    });
}
