// Yes, edit this file to test somethintg new.
import { makeJack } from './Anatomy/makeJack.js'
import { makeWireText } from './WireParts/makeWireText.js'
import { makeText } from './Parts/makeText.js'

export const testBed = rootUniverse => {
  const universe = rootUniverse

  const globalLeftOffset = 0
  const globalTopOffset = 0

  const worldX = value => value - globalLeftOffset
  const worldY = value => value - globalTopOffset

  const textThing = makeText(`Hello, I was made with the regular makeText("blah") syntax`)

  textThing.x = worldX(50)
  textThing.y = worldY(25)
  universe.addChild(textThing)



  Promise.all([
    makeWireText({
      name: 'textA',
      x: worldX(50),
      y: worldY(50),
      universe,
      message: 'Hi, I was made with makeWireText({blah}) syntax.'
    }).then(wireText => {
      const { container } = wireText
      universe.addChild(container)
    }),
    makeWireText({
      name: 'textB',
      x: worldX(150),
      y: worldY(150),
      universe,
      message: 'Hi, I was made with makeWireText({blah}) syntax.'
    }).then(wireText => {
      const { container } = wireText
      universe.addChild(container)
    }),
    makeJack({
      x: worldX(64),
      y: worldY(300),
      universe,
      name: 'Ticker Jack',
      kind: 'output-string',
      connectionValidator({ jack }) {
        if (jack.kind === 'input-string') {
          return true
        } else {
          return false
        }
      }
    }).then((jack) => {
      let counter = 0
      setInterval(() => {
        jack.broadcastToConnections(`Howdy! Heres a Tick: ${counter}`)
        counter++
      }, 1000)
      universe.addChild(jack.container)
    })
  ])

}
