// Yes, edit this file to test somethintg new.

import { makeJack } from './Anatomy/makeJack.js'
import { makeToolbox } from './Parts/makeToolbox.js'

import { makeVerletPoint } from '../Wire/Verlet/makeVerletPoint.js'
import { makeVerletStick } from '../Wire/Verlet/makeVerletStick.js'
import { distanceBetweenPoints } from '../Wire/Verlet/utilities.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse
  // const top = 20
  // const left = 20
  // const space = 30

  // const lowerTop = top + 150

  const connectPointsWithLine = ({ pointA, pointB, ...rest }) => {
    const length = distanceBetweenPoints({ pointA, pointB })
    const stick = makeVerletStick({ pointA, pointB, length, ...rest })
    universe.addChild(stick.line)
  }

  const vp0 = makeVerletPoint({ x: 590, y: -400, isPinned: true })
  const vpA = makeVerletPoint({ x: 50, y: 50, })
  const vpB = makeVerletPoint({ x: 200, y: 50 })
  const vpC = makeVerletPoint({ x: 50, y: 200 })
  const vpD = makeVerletPoint({ x: 200, y: 200 })

  connectPointsWithLine({
    pointA: vp0,
    pointB: vpB
  })
  connectPointsWithLine({
    pointA: vpA,
    pointB: vpB
  })
  connectPointsWithLine({
    pointA: vpB,
    pointB: vpD,
  })
  connectPointsWithLine({
    pointA: vpD,
    pointB: vpC
  })
  connectPointsWithLine({
    pointA: vpC,
    pointB: vpA
  })
  connectPointsWithLine({
    pointA: vpA,
    pointB: vpD,
    hidden: true
  })
  universe.addChild(vp0.circle)
  universe.addChild(vpA.circle)
  universe.addChild(vpB.circle)
  universe.addChild(vpC.circle)
  universe.addChild(vpD.circle)
  // universe.addChild(stick.line)

  // const rgbToolbox = makeToolbox({
  //   name: 'RGB Toolbox!',
  //   universe,
  //   width: 150,
  //   height: 90,
  //   hideBox: true,
  //   x: 10,
  //   y: 15
  // })

  // const cymToolbox = makeToolbox({
  //   name: 'CYM Toolbox!!',
  //   universe,
  //   width: 150,
  //   height: 90,
  //   hideBox: true,
  //   x: 200,
  //   y: lowerTop
  // })

  // const redJack = makeJack({
  //   name: 'redJack',
  //   x: left,
  //   y: top,
  //   tint: 0xff0000,
  //   universe
  // })
  // const greenJack = makeJack({
  //   name: 'greenJack',
  //   x: left + space,
  //   y: top,
  //   tint: 0x00ff00,
  //   universe
  // })
  // const blueJack = makeJack({
  //   name: 'blueJack',
  //   x: left + (space * 2),
  //   y: top,
  //   tint: 0x0000ff,
  //   universe
  // })

  // const cyanJack = makeJack({
  //   name: 'cyanJack',
  //   x: left,
  //   y: top,
  //   tint: 0x00ffff,
  //   universe
  // })
  // const yellowJack = makeJack({
  //   name: 'yellowJack',
  //   x: left + space,
  //   y: top,
  //   tint: 0xffff00,
  //   universe
  // })
  // const magentaJack = makeJack({
  //   name: 'magentaJack',
  //   x: left + (space * 2),
  //   y: top,
  //   tint: 0xff00ff,
  //   universe
  // })

  // rgbToolbox.addChild(redJack.container)
  // rgbToolbox.addChild(greenJack.container)
  // rgbToolbox.addChild(blueJack.container)

  // cymToolbox.addChild(cyanJack.container)
  // cymToolbox.addChild(yellowJack.container)
  // cymToolbox.addChild(magentaJack.container)

  // rootUniverse.addChild(rgbToolbox.container)
  // rootUniverse.addChild(cymToolbox.container)

  // redJack.connectTo({ jack: yellowJack })
  // yellowJack.connectTo({ jack: redJack })
  // cyanJack.connectTo({ jack: greenJack })
  // magentaJack.connectTo({ jack: blueJack })
}
