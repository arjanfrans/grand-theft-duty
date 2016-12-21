# Grand Theft Duty

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f1631b8ec2f744969c619fbf779e1481)](https://www.codacy.com/app/arjanfrans/grand-theft-duty?utm_source=github.com&utm_medium=referral&utm_content=arjanfrans/grand-theft-duty&utm_campaign=badger)
[![Build Status](https://travis-ci.org/arjanfrans/grand-theft-duty.svg)](https://travis-ci.org/arjanfrans/grand-theft-duty)
[![Dependency Status](https://david-dm.org/arjanfrans/grand-theft-duty.svg)](https://david-dm.org/arjanfrans/grand-theft-duty)
[![devDependency Status](https://david-dm.org/arjanfrans/grand-theft-duty/dev-status.svg)](https://david-dm.org/arjanfrans/grand-theft-duty#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/arjanfrans/grand-theft-duty/badge.svg?branch=master&service=github)](https://coveralls.io/github/arjanfrans/grand-theft-duty?branch=master)
[![Gratipay](https://img.shields.io/gratipay/arjanfrans.svg)](https://gratipay.com/~arjanfrans)

A top-down shooter inspired by the classic Grand Theft Auto games and Call of Duty.
Grand Theft Duty combines elements of both games.

The game is built using [three.js](http://threejs.org/three.js) for graphics and [howler.js](https://github.com/goldfire/howler.js)
for audio.

### Goals
* Playble in the browser
* Play with keyboard or gamepad
* Split screen mode
* Online multyplayer
* Basic AI
* Original graphics and sounds
* Map Editor

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

## Development tools
* [BMFont](http://www.angelcode.com/products/bmfont/): generate bitmap fonts.
* [spritesheet-js (fork)](https://github.com/arjanfrans/spritesheet.js): generate spritesheets.
Requires `imagemagick` to be installed.
* [audiosprite](https://github.com/tonistiigi/audiosprite): generate audiosprites for howler.js.
Requires `ffmpeg` to be installed.
