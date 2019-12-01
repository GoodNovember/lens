// Yes, edit this file to test somethintg new.
import { makeJack } from './Anatomy/makeJack.js'
import { makeDestination } from './Noises/makeDestination.js'
import { makeContext } from './Noises/makeContext.js'
import { makeOscillator } from './Noises/makeOscillator.js'
import { makeTrigger } from './Noises/makeTrigger.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  const globalLeftOffset = 0
  const globalTopOffset = 0

  const worldX = value => value - globalLeftOffset
  const worldY = value => value - globalTopOffset

  const context = makeContext()

  Promise.all([
    makeTrigger({
      x: worldX(10),
      y: worldY(10),
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
    })
  ]).then(results => results.map(({ container }) => {
    universe.addChild(container)
  }))

}
