import { makeRect } from '../Utilities/makeRect.js'
import { makeJack } from '../Anatomy/makeJack.js'
import { PIXI } from '../Utilities/localPIXI.js'

const { Container } = PIXI
export const makeTrigger = async ({
  x,
  y,
  name = `[unnamed trigger]`,
  context,
  universe
}) => {
  const container = new Container()

  const buttonElement = makeRect({
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    interactive: true
  })

  container.addChild(buttonElement)

  container.x = x
  container.y = y

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

  container.addChild(
    trigger.container
  )

  buttonElement.on('pointerdown', () => {
    trigger.broadcastToConnections(0)
  })

  return {
    container,
    universe,
    jacks: {
      trigger
    }
  }
}