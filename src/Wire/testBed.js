// Yes, edit this file to test somethintg new.

import { makeJack } from './Anatomy/makeJack.js'
import { makeToolbox } from './Parts/makeToolbox.js'

import { makeWire } from './Anatomy/makeWire.js'

export const testBed = rootUniverse => {

  const top = 20
  const left = 20
  const space = 30

  const secondTop = top + 50

  const rgbToolbox = makeToolbox({
    width: 150,
    height: 90,
    hideBox: true,
    x: 10,
    y: 15
  })

  const cymToolbox = makeToolbox({
    width: 150,
    height: 90,
    hideBox: true,
    x: 200,
    y: secondTop
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

  const cyanJack = makeJack({
    name: 'cyan',
    x: left,
    y: top,
    tint: 0x00ffff
  })
  const yellowJack = makeJack({
    name: 'yellow',
    x: left + space,
    y: top,
    tint: 0xffff00
  })
  const magentaJack = makeJack({
    name: 'magenta',
    x: left + (space * 2),
    y: top,
    tint: 0xff00ff
  })

  const disconnectRedToCyanWire = makeWire({
    jackA: redJack,
    jackB: cyanJack,
  })

  rgbToolbox.addChild(redJack.container)
  rgbToolbox.addChild(greenJack.container)
  rgbToolbox.addChild(blueJack.container)

  cymToolbox.addChild(cyanJack.container)
  cymToolbox.addChild(yellowJack.container)
  cymToolbox.addChild(magentaJack.container)

  rootUniverse.addChild(rgbToolbox.container)
  rootUniverse.addChild(cymToolbox.container)

}
