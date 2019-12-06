import { makeRect } from '../Utilities/makeRect.js'
import { makeJack } from '../Anatomy/makeJack.js'
import { makeToolbox } from '../Parts/makeToolbox.js'

export const makeTrigger = async ({
  x,
  y,
  name = '[unnamed trigger]',
  universe
}) => {
  const toolbox = makeToolbox({
    x,
    y,
    name: `[${name}]'s toolbox`,
    width: 120,
    height: 100
  })
  const container = toolbox.container

  const triggerElement = makeRect({
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    interactive: true
  })

  toolbox.addChild(triggerElement)

  const jackTrigger = await makeJack({
    x: 50 + 8,
    y: 25,
    name: `[${name}]'s trigger jack`,
    themeImage: 'jackTrigger',
    kind: 'trigger',
    universe
  })

  toolbox.addChild(
    jackTrigger.container
  )

  const forwardEventToJack = ({
    eventName
  }) => {
    triggerElement.on(eventName, event => {
      jackTrigger.broadcastToConnections({ event, eventName })
    })
  }

  const eventsToForwardToTriggerJack = [
    'pointerdown',
    'pointerup',
    'pointerupoutside'
  ]

  for (const eventName of eventsToForwardToTriggerJack) {
    forwardEventToJack({ eventName })
  }

  return {
    toolbox,
    container,
    universe,
    jacks: {
      jackTrigger
    }
  }
}
