mkdir -p tmp
git clone --depth=1 https://github.com/mrdoob/three.js.git tmp/three.js
cd tmp/three.js/utils/build
npm install
node build.js --include common --include extras
