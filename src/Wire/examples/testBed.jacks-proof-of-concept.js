// Yes, edit this file to test somethintg new.

import { makeJack } from './Anatomy/makeJack.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

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
