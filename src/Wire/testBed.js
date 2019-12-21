// Yes, edit this file to test somethintg new.
import { batchMake, batchConnect } from './registry.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  const globalLeftOffset = 0
  const globalTopOffset = 0

  const gridSize = 64

  const worldX = value => value - globalLeftOffset
  const worldY = value => value - globalTopOffset

  const gridX = value => worldX(value * gridSize)
  const gridY = value => worldY(value * gridSize)

  const thingsToMake = [
    {
      thing: 'gain',
      ingredients: {
        name: 'gain',
        x: gridX(1),
        y: gridY(5)
      }
    },
    {
      thing: 'trigger',
      ingredients: {
        name: 'trigger-A',
        x: gridX(1),
        y: gridY(1)
      }
    },
    {
      thing: 'trigger',
      ingredients: {
        name: 'trigger-B',
        x: gridX(1),
        y: gridY(3)
      }
    },
    {
      thing: 'oscillator',
      ingredients: {
        name: 'osc-A',
        x: gridX(4),
        y: gridY(2)
      }
    },
    {
      thing: 'oscillator',
      ingredients: {
        name: 'osc-B',
        x: gridX(6),
        y: gridY(2)
      }
    },
    {
      thing: 'destination',
      ingredients: {
        name: 'our-destination',
        x: gridX(8),
        y: gridY(3)
      }
    },
    {
      thing: 'range',
      ingredients: {
        name: 'handy-range',
        x: gridX(4),
        y: gridY(0)
      }
    }
  ]

  const connectionsToConnect = [
    "[[osc-b]'s connector jack] -> [[our-destination]'s connector jack]",
    "[[trigger-a]'s trigger jack] -> [[osc-b]'s start jack]",
    "[[trigger-b]'s trigger jack] -> [[osc-b]'s stop jack]"
  ]

  batchMake({
    thingsToMake,
    universe
  }).then(madeThings => {
    for (const madeThing of madeThings) {
      universe.addChild(madeThing.container)
    }
    batchConnect(connectionsToConnect)
  })
}
