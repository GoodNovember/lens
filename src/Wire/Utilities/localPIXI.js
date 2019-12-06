import * as PIXI from 'pixi.js-legacy'
global.PIXI = PIXI
require('pixi-layers')
PIXI.utils.skipHello() // calling this skips the Hello, it also makes you a jerk face if you call it.
export { PIXI }
