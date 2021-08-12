# Grand Theft Duty

[![Dependency Status](https://david-dm.org/arjanfrans/grand-theft-duty.svg)](https://david-dm.org/arjanfrans/grand-theft-duty)
[![devDependency Status](https://david-dm.org/arjanfrans/grand-theft-duty/dev-status.svg)](https://david-dm.org/arjanfrans/grand-theft-duty#info=devDependencies)

A top-down shooter inspired by the classic Grand Theft Auto games and Call of Duty.
Grand Theft Duty combines elements of both games.

The game is built using [three.js](http://threejs.org/three.js) for graphics and [howler.js](https://github.com/goldfire/howler.js)
for audio.

## Demo

[grand-theft-duty.arjanfrans.com](http://grand-theft-duty.arjanfrans.com/)

## Setup

Clone the repository:
```
git clone https://github.com/arjanfrans/grand-theft-duty
```

Go into the project directory and install packages:
```
npm install
```

Start the game:
```
npm start
```

## Development

Integrated tools:

* Build the spritesheets: `npm run build:spritesheets`
  * Requires `imagemagick`
* Build the audiosprites: `npm run build:audiosprites`
  * Requires `ffmpeg`

Requirements can be installed by running `npm run dev:install-requirements`.

Other tools:
* [BMFont](http://www.angelcode.com/products/bmfont/): generate bitmap fonts.

## Credits

Code is used from the following repositories:

* [audiosprite](https://github.com/tonistiigi/audiosprite) for generating audio sprites out of multiple audio files.
* [spritesheet.js](https://github.com/krzysztof-o/spritesheet.js/) for generating spritesheets out of multiple images.
* [sat.js](https://github.com/jriecken/sat-js) for collision detection.
