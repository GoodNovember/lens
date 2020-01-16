import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { makePlate } from '../Parts/makePlate.js'
import { makeText } from '../Parts/makeText.js'

import { getGlobalAudioContext } from './getGlobalAudioContext.js'

import theme from '../Theme/imperfection/theme'
const { destinationColor } = theme

const context = getGlobalAudioContext()
export const makeEnvelope = async ({
  x, y,
  name = 'unnamed Envelope',
  universe
}) => {
  const connectorJack = await makeJack({
    universe,
    x: 8,
    y: 8,
    name: `[${name}]'s connector jack`
  })

  const attackJack = await makeJack({
    universe,
    x: 8,
    y: 8,
    name: `[${name}]'s attack jack`
  })

  const releaseJack = await makeJack({
    universe,
    x: 8,
    y: 8,
    name: `[${name}]'s release jack`
  })

  return {
    container
  }
}
