// Yes, edit this file to test somethintg new.

import { makeJack } from './Anatomy/makeJack.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  //parable: 
  //  A stick requires two points and a length
  //  A point requires a horizontal location (x) and a vertical location (y)
  //    The locations can be anywhere between Negative infinity and positive infinity.
  //      ... -Infinity < location > Infinity
  //      ... -9999999999999(...) < location > 9999999999999(...)
  //      ... zero is the middle, but there is no middle in the concept of universes.
  //      ... middle is a concept aggred upon, and an agreement requires at least two parties.
  //      ... a stick has a middle, because it is an agreement between two points.
  //      ... a circle has a middle because its middle performs as a common point around which an infinite number of points are arranged, 1 radius away from it.

  const globalLeftOffset = 0
  const globalTopOffset = 0

  const worldX = value => value - globalLeftOffset
  const worldY = value => value - globalTopOffset

  makeJack({
    name: 'jack a',
    universe,
    x: worldX(32 / 2),
    y: worldY(32 / 2),
    kind: 'output',
    connectionValidator({ jack }) {
      if (jack.kind === 'input') {
        return true
      } else {
        return false
      }
    }
  }).then(jackA => {
    universe.addChild(jackA.container)
    let counter = 0
    setInterval(() => {
      console.time(`flight[${counter}]`)
      jackA.broadcastToConnections({ counter })
      counter++
    }, 5000)

  })

  makeJack({
    name: 'jack b',
    universe,
    x: worldX(100),
    y: worldY(100),
    kind: 'input',
    connectionValidator({ jack }) {
      if (jack.kind === 'output') {
        return true
      }
      return false
    }
  }).then(jackB => {
    universe.addChild(jackB.container)
    jackB.container.on('broadcast', ({ jack, payload }) => {
      console.timeEnd(`flight[${payload.counter}]`)
      console.log('Broadcast From', jack.name, payload)
    })
  })

  makeJack({
    name: 'jack c',
    universe,
    x: worldX(150),
    y: worldY(100),
    kind: 'input',
    connectionValidator({ jack }) {
      if (jack.kind === 'output') {
        return true
      } else {
        return false
      }
    }
  }).then(jackC => {
    universe.addChild(jackC.container)
  })

}
