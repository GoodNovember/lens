// Yes, edit this file to test somethintg new.

import path from 'path'
import { makeDiagram } from './Diagram/makeDiagram.js'
import { makeJack } from './Anatomy/makeJack.js'
import { makeToolbox } from './Parts/makeToolbox.js'

const directoryPath = path.resolve('src/Wire/Diagram/targetDirectory/')

export const testBed = () => {
  // return makeDiagram({ directoryPath })
  const toolbox = makeToolbox({
    width: 200,
    height: 150,
    hideBox: true,
    x: 10,
    y: 15
  })

  const greenJack = makeJack({x:30, y:20, tint:0x00ff00})
  const redJack = makeJack({x:80, y:20, tint:0xff0000})
  const blueJack = makeJack({x:30, y:20, tint:0x0000ff})
  const cyanJack = makeJack({x:80, y:20, tint:0x00ffff})
  const magentaJack = makeJack({x: 30, y: 20, tint:0xff00ff})
  const yellowJack = makeJack({x: 30, y: 20, tint:0xffff00})

  toolbox.addChild(greenJack.container)
  toolbox.addChild(redJack.container)

  return toolbox
}
