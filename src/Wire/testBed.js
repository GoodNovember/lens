// Yes, edit this file to test somethintg new.

import { makeJack } from './Anatomy/makeJack.js'
import { makeToolbox } from './Parts/makeToolbox.js'
import { makeWire } from './Anatomy/makeWire2.js'

import { makeWire } from './Anatomy/makeWire.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  const top = 20
  const left = 20
  const space = 30

  const secondTop = top + 50

  const rgbToolbox = makeToolbox({
    universe,
    width: 150,
    height: 90,
    hideBox: true,
    x: 10,
    y: 15
  })

  const cymToolbox = makeToolbox({
    universe,
    width: 150,
    height: 90,
    hideBox: true,
    x: 200,
    y: 115
  })

  const redJack = makeJack({
    name: 'red',
    x: left,
    y: top,
    tint: 0xff0000
  })
  const greenJack = makeJack({
    name: 'green',
    x: left + space,
    y: top,
    tint: 0x00ff00
  })
  const blueJack = makeJack({
    name: 'blue',
    x: left + (space * 2),
    y: top,
    tint: 0x0000ff
  })

  const redJack = makeJack({ x: left, y: top, tint: 0xff0000, universe })
  const greenJack = makeJack({ x: left + space, y: top, tint: 0x00ff00, universe })
  const blueJack = makeJack({ x: left + (space * 2), y: top, tint: 0x0000ff, universe })

  const cyanJack = makeJack({ x: left, y: top, tint: 0x00ffff, universe })
  const yellowJack = makeJack({ x: left + space, y: top, tint: 0xffff00, universe })
  const magentaJack = makeJack({ x: left + (space * 2), y: top, tint: 0xff00ff, universe })

  rgbToolbox.addChild(redJack.container)
  rgbToolbox.addChild(greenJack.container)
  rgbToolbox.addChild(blueJack.container)

  cymToolbox.addChild(cyanJack.container)
  cymToolbox.addChild(yellowJack.container)
  cymToolbox.addChild(magentaJack.container)

  rootUniverse.addChild(rgbToolbox.container)
  rootUniverse.addChild(cymToolbox.container)

  const wire = makeWire({
    jackA: redJack,
    jackB: yellowJack
  })

  rootUniverse.wireLayer.addChild(wire.container)

  // rootUniverse.addChild(wire.container)
}
