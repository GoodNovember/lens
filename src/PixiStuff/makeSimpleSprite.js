// import * as PIXI from 'pixi.js'
import * as PIXI from 'pixi.js-legacy'
const { Sprite, Texture } = PIXI
const { WHITE } = Texture

export const makeSimpleSprite = () => new Sprite(WHITE)
