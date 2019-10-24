// Yes, edit this file to test somethintg new.

import { makeJack } from './Anatomy/makeJack.js'
import { makeToolbox } from './Parts/makeToolbox.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  const top = 20
  const left = 20
  const space = 30

  const lowerTop = top + 150

  const rgbToolbox = makeToolbox({
    name: 'RGB Toolbox!',
    universe,
    width: 150,
    height: 90,
    hideBox: true,
    x: 10,
    y: 15
  })

  const cymToolbox = makeToolbox({
    name: 'CYM Toolbox!!',
    universe,
    width: 150,
    height: 90,
    hideBox: true,
    x: 200,
    y: lowerTop
  })

  const redJack = makeJack({
    name: 'redJack',
    x: left,
    y: top,
    tint: 0xff0000,
    universe
  })
  const greenJack = makeJack({
    name: 'greenJack',
    x: left + space,
    y: top,
    tint: 0x00ff00,
    universe
  })
  const blueJack = makeJack({
    name: 'blueJack',
    x: left + (space * 2),
    y: top,
    tint: 0x0000ff,
    universe
  })

  const cyanJack = makeJack({
    name: 'cyanJack',
    x: left,
    y: top,
    tint: 0x00ffff,
    universe
  })
  const yellowJack = makeJack({
    name: 'yellowJack',
    x: left + space,
    y: top,
    tint: 0xffff00,
    universe
  })
  const magentaJack = makeJack({
    name: 'magentaJack',
    x: left + (space * 2),
    y: top,
    tint: 0xff00ff,
    universe
  })

  rgbToolbox.addChild(redJack.container)
  rgbToolbox.addChild(greenJack.container)
  rgbToolbox.addChild(blueJack.container)

  cymToolbox.addChild(cyanJack.container)
  cymToolbox.addChild(yellowJack.container)
  cymToolbox.addChild(magentaJack.container)

  rootUniverse.addChild(rgbToolbox.container)
  rootUniverse.addChild(cymToolbox.container)

  // redJack.connectTo({ jack: yellowJack })
  yellowJack.connectTo({ jack: redJack })
  cyanJack.connectTo({ jack: greenJack })
  magentaJack.connectTo({ jack: blueJack })
}
