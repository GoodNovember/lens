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
        x: gridX(6),
        y: gridY(4)
      }
    },
    {
      thing: 'trigger',
      ingredients: {
        name: 'trigger-A',
        x: gridX(1),
        y: gridY(3)
      }
    },
    {
      thing: 'trigger',
      ingredients: {
        name: 'trigger-B',
        x: gridX(1),
        y: gridY(5)
      }
    },
    {
      thing: 'oscillator',
      ingredients: {
        name: 'osc-A',
        x: gridX(4),
        y: gridY(3)
      }
    },
    {
      thing: 'oscillator',
      ingredients: {
        name: 'osc-B',
        x: gridX(4),
        y: gridY(5)
      }
    },
    {
      thing: 'destination',
      ingredients: {
        name: 'our-destination',
        x: gridX(7),
        y: gridY(4.25)
      }
    },
    {
      thing: 'range',
      ingredients: {
        name: 'handy-range',
        x: gridX(1),
        y: gridY(1)
      }
    },
    {
      thing: 'analyser',
      ingredients: {
        name: 'visi-a',
        x: gridX(7),
        y: gridY(5)
      }
    },
    {
      thing: 'USBDeviceTray',
      ingredients: {
        name: 'fancy-usb-tray',
        x: gridX(10),
        y: gridY(1)
      }
    },
    {
      thing: 'UserMediaTray',
      ingredients: {
        name: 'Special User Media Tray',
        x: gridX(12),
        y: gridY(1)
      }
    },
    {
      thing: 'MIDIDeviceTray',
      ingredients: {
        name: 'Special User Media Tray',
        x: gridX(5),
        y: gridY(7)
      }
    },
    {
      thing: 'Recorder',
      ingredients: {
        name: 'Patient Recorder',
        x: gridX(6),
        y: gridY(6)
      }
    }
  ]

  const connectionsToConnect = [
    "[[osc-b]'s connector jack] -> [[gain]'s connector jack]",
    "[[osc-a]'s connector jack] -> [[gain]'s gain jack]",
    "[[gain]'s connector jack] -> [[our-destination]'s connector jack]",
    "[[trigger-a]'s trigger jack] -> [[osc-b]'s start jack]",
    "[[trigger-b]'s trigger jack] -> [[osc-b]'s stop jack]",
    "[[trigger-a]'s trigger jack] -> [[osc-a]'s start jack]",
    "[[trigger-b]'s trigger jack] -> [[osc-a]'s stop jack]",
    "[[handy-range]'s valuejack] -> [[osc-a]'s detune jack]",
    "[[gain]'s connector jack] -> [[visi-a]'s connector jack]",
    "[[gain]'s connector jack] -> [[patient recorder]'s connector jack]"
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
