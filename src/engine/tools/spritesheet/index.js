import * as generator from './generator';
import * as async from 'async'
import * as fs from 'fs'
import * as path from 'path'

var FORMATS = {
  'json': {template: 'json.template', extension: 'json', trim: false},
  'node': {template: 'node.template', extension: 'js', trim: false},
  'nodearray': {template: 'nodearray.template', extension: 'js', trim: false},
  'yaml': {template: 'yaml.template', extension: 'yaml', trim: false},
  'jsonarray': {template: 'jsonarray.template', extension: 'json', trim: false},
  'pixi.js': {template: 'json.template', extension: 'json', trim: true},
  'starling': {template: 'starling.template', extension: 'xml', trim: true},
  'sparrow': {template: 'starling.template', extension: 'xml', trim: true},
  'easel.js': {template: 'easeljs.template', extension: 'json', trim: false},
  'cocos2d': {template: 'cocos2d.template', extension: 'plist', trim: false},
  'css': {template: 'css.template', extension: 'css', trim: false}
};

export async function generate(files, options) {
  if (files.length === 0) {
    throw new Error('no files specified');
  }

  options = options || {};
  if (Array.isArray(options.format)) {
    options.format = options.format.map(function(x){return FORMATS[x]});
  }
  else if (options.format || !options.customFormat) {
    options.format = [FORMATS[options.format] || FORMATS['json']];
  }
  options.name = options.name || 'spritesheet';
  options.spritesheetName = options.name;
  options.path = path.resolve(options.path || '.');
  options.fullpath = options.hasOwnProperty('fullpath') ? options.fullpath : false;
  options.square = options.hasOwnProperty('square') ? options.square : false;
  options.powerOfTwo = options.hasOwnProperty('powerOfTwo') ? options.powerOfTwo : false;
  options.extension = options.hasOwnProperty('extension') ? options.extension : options.format[0].extension;
  options.trim = options.hasOwnProperty('trim') ? options.trim : options.format[0].trim;
  options.algorithm = options.hasOwnProperty('algorithm') ? options.algorithm : 'growing-binpacking';
  options.sort = options.hasOwnProperty('sort') ? options.sort : 'maxside';
  options.padding = options.hasOwnProperty('padding') ? Number.parseInt(options.padding, 10) : 0;
  options.prefix = options.hasOwnProperty('prefix') ? options.prefix : '';
  options.extrude = options.hasOwnProperty('extrude') ? parseInt(options.extrude, 10) : 0;

  files = files.map(function (item, index) {
    var resolvedItem = path.resolve(item);
    var name = "";
    if (options.fullpath) {
      name = item.substring(0, item.lastIndexOf("."));
    }
    else {
      name = options.prefix + resolvedItem.substring(resolvedItem.lastIndexOf(path.sep) + 1, resolvedItem.lastIndexOf('.'));
    }
    return {
      index: index,
      path: resolvedItem,
      name: name,
      extension: path.extname(resolvedItem)
    };
  });


  if (!fs.existsSync(options.path) && options.path !== '') fs.mkdirSync(options.path);

  files = await generator.copyFiles(files);
  files = await generator.getImagesSizes(files, options);
  await generator.extrudeImages(files, options)
  options = generator.determineCanvasSize(files, options);
  await generator.generateImage(files, options);
  await generator.generateData(files, options);
  await generator.clearTempFiles(files);
}
