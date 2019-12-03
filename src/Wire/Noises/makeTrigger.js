import { makeRect } from '../Utilities/makeRect.js'
import { makeJack } from '../Anatomy/makeJack.js'
import { makeToolbox } from '../Parts/makeToolbox.js'

export const makeTrigger = async ({
  x,
  y,
  name = `[unnamed trigger]`,
  universe
}) => {
  const toolbox = makeToolbox({
    x,
    y,
    name: `[${name}]'s toolbox`,
    width: 120,
    height: 100,
  })
  const container = toolbox.container

  const buttonElement = makeRect({
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    interactive: true
  })

  toolbox.addChild(buttonElement)

  const jackIngredients = [
    {
      x: 50 + 8,
      y: 25,
      name: `[${name}]'s trigger jack`,
      themeImage: 'jackTrigger',
      universe
    }
  ]

  const [
    trigger,
  ] = await Promise.all(
    jackIngredients.map(
      ingredients => makeJack(ingredients)
    )
  )

  toolbox.addChild(
    trigger.container
  )

  buttonElement.on('pointerdown', () => {
    trigger.broadcastToConnections(0)
  })

  return {
    toolbox,
    container,
    universe,
    jacks: {
      trigger
    }
  }
}