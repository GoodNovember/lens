import path from 'path'
import { makeDiagram } from './Diagram/makeDiagram.js'

const directoryPath = path.resolve('src/Wire/Diagram/targetDirectory/')

export const testBed = () => {
  return makeDiagram({ directoryPath })
}
