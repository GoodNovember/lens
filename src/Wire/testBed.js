// Yes, edit this file to test somethintg new.
import { makeContext } from './Noises/makeContext.js'

import { batchMake } from './registry.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  const globalLeftOffset = 0
  const globalTopOffset = 0

  const worldX = value => value - globalLeftOffset
  const worldY = value => value - globalTopOffset

  const context = makeContext()

  const thingsToMake = [
    {
      thing: 'gain',
      ingredients: {
        name: 'gain',
        x: worldX(30),
        y: worldY(300),
        context,
        universe
      }
    },
    {
      thing: 'trigger',
      ingredients: {
        name: 'trigger-A',
        x: worldX(10),
        y: worldY(10),
        universe
      }
    },
    {
      thing: 'trigger',
      ingredients: {
        name: 'trigger-B',
        x: worldX(10),
        y: worldY(90),
        universe
      }
    },
    {
      thing: 'oscillator',
      ingredients: {
        name: 'osc-A',
        x: worldX(100),
        y: worldY(100),
        context,
        universe
      }
    },
    {
      thing: 'destination',
      ingredients: {
        name: 'our-destination',
        x: worldX(100),
        y: worldY(200),
        universe,
        context
      }
    },
    {
      thing: 'range',
      ingredients: {
        name: 'handy-range',
        x: worldX(500),
        y: worldY(700),
        universe
      }
    }
  ]

  batchMake(thingsToMake).then(madeThings => {
    for (const madeThing of madeThings) {
      universe.addChild(madeThing.container)
    }
  })
}
