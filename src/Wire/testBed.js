import { makeDirectoryLens } from './Parts/makeDirectoryLens.js'
const INITIAL_DIRECTORY = `~/Desktop`
export const testBed = () => {
  const directoryLens = makeDirectoryLens({ directory: INITIAL_DIRECTORY })
  return {
    ...directoryLens
  }
}
