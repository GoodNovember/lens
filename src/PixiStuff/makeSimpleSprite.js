import * as PIXI from 'pixi.js'
const { Sprite, Texture } = PIXI
const { WHITE } = Texture

export const makeSimpleSprite = () => new Sprite(WHITE)
