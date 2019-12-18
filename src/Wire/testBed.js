// Yes, edit this file to test somethintg new.
import { makeContext } from './Noises/makeContext.js'

import { batchMake } from './registry.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  const globalLeftOffset = 0
  const globalTopOffset = 0

  const gridSize = 64

  const worldX = value => value - globalLeftOffset
  const worldY = value => value - globalTopOffset

  const gridX = value => worldX(value * gridSize)
  const gridY = value => worldY(value * gridSize)

  const context = makeContext()

  // const thingsToMake = [
  //   {
  //     thing: 'gain',
  //     ingredients: {
  //       name: 'gain',
  //       x: gridX(1),
  //       y: gridY(5),
  //       context,
  //       universe
  //     }
  //   },
  //   {
  //     thing: 'trigger',
  //     ingredients: {
  //       name: 'trigger-A',
  //       x: gridX(1),
  //       y: gridY(1),
  //       universe
  //     }
  //   },
  //   {
  //     thing: 'trigger',
  //     ingredients: {
  //       name: 'trigger-B',
  //       x: gridX(1),
  //       y: gridY(3),
  //       universe
  //     }
  //   },
  //   {
  //     thing: 'oscillator',
  //     ingredients: {
  //       name: 'osc-A',
  //       x: gridX(4),
  //       y: gridY(2),
  //       context,
  //       universe
  //     }
  //   },
  //   {
  //     thing: 'destination',
  //     ingredients: {
  //       name: 'our-destination',
  //       x: gridX(8),
  //       y: gridY(3),
  //       universe,
  //       context
  //     }
  //   },
  //   {
  //     thing: 'range',
  //     ingredients: {
  //       name: 'handy-range',
  //       x: gridX(4),
  //       y: gridY(0),
  //       universe
  //     }
  //   }
  // ]

  const thingsToMake = [
    {
      thing: 'toolbox',
      ingredients: {
        name: 'basicBox',
        x: gridX(1),
        y: gridY(2),
        height: 100,
        width: 100,
        universe
      }
    },
    {
      thing: 'toolbox',
      ingredients: {
        name: 'plainBox',
        x: gridX(3),
        y: gridY(2),
        height: 100,
        width: 100,
        universe
      }
    },
    {
      thing: 'plate',
      ingredients: {
        name: 'plainPlate',
        x: gridX(3),
        y: gridY(5),
        height: 64,
        width: 64,
        tint: 0x00ff00,
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
