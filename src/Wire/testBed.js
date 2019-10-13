// Yes, edit this file to test somethintg new.

import { makeJack } from './Anatomy/makeJack.js'
import { makeToolbox } from './Parts/makeToolbox.js'

export const testBed = rootUniverse => {

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
    y: 15
  })

  const top = 20
  const left = 20
  const space = 30

  const redJack = makeJack({x: left, y: top, tint: 0xff0000})
  const greenJack = makeJack({x: left + space, y: top, tint: 0x00ff00})
  const blueJack = makeJack({x: left + (space * 2), y: top, tint: 0x0000ff})

  const cyanJack = makeJack({x: left, y: top, tint: 0x00ffff})
  const yellowJack = makeJack({x: left + space, y: top, tint: 0xffff00})
  const magentaJack = makeJack({x: left + (space * 2), y: top, tint: 0xff00ff})

  rgbToolbox.addChild(redJack.container)
  rgbToolbox.addChild(greenJack.container)
  rgbToolbox.addChild(blueJack.container)

  cymToolbox.addChild(cyanJack.container)
  cymToolbox.addChild(yellowJack.container)
  cymToolbox.addChild(magentaJack.container)

  rootUniverse.addChild(rgbToolbox.container)
  rootUniverse.addChild(cymToolbox.container)

}
