// Yes, edit this file to test somethintg new.
import { makeDestination } from './Noises/makeDestination.js'
import { makeContext } from './Noises/makeContext.js'
import { makeOscillator } from './Noises/makeOscillator.js'
import { makeTrigger } from './Noises/makeTrigger.js'
import { makeGain } from './Noises/makeGain.js'
import { makeRange } from './Noises/makeRange.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  const globalLeftOffset = 0
  const globalTopOffset = 0

  const worldX = value => value - globalLeftOffset
  const worldY = value => value - globalTopOffset

  const context = makeContext()

  Promise.all([
    makeGain({
      name: 'gain',
      x: worldX(30),
      y: worldY(300),
      context,
      universe
    }),
    makeTrigger({
      name: 'trigger-A',
      x: worldX(10),
      y: worldY(10),
      universe
    }),
    makeTrigger({
      name: 'trigger-B',
      x: worldX(10),
      y: worldY(90),
      universe
    }),
    makeOscillator({
      x: worldX(100),
      y: worldY(100),
      name: 'osc-A',
      context,
      universe
    }),
    makeDestination({
      x: worldX(100),
      y: worldY(200),
      name: 'our-destination',
      universe,
      context
    }),
    makeRange({
      x: worldX(500),
      y: worldY(700),
      name: 'handy-range',
      universe
    })
  ]).then(results => results.map(({ container }) => {
    universe.addChild(container)
  }))
}
