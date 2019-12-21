
import { makeContext } from './makeContext.js'

let globalAudioContext = null

export const getGlobalAudioContext = () => {
  if (!globalAudioContext) {
    globalAudioContext = makeContext()
    console.log('Global WebAudioContext Initialized.')
  }
  return globalAudioContext
}
