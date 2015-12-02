# Grand Theft Duty

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
