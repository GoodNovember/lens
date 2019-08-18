import { makeToolbox } from './makeToolbox.js'
import { makeUniverse } from './makeUniverse.js'
import { makeEventForwarder } from './makeEventForwarder.js'

export const makeUniversalToolbox = ({
	...toolboxParams
}) => {
	const internalToolbox = makeToolbox({ ...toolboxParams })
	const internalUniverse = makeUniverse({})
	
	const tellTheKids = makeEventForwarder(internalUniverse)

	internalToolbox.addChild(internalUniverse.container)
	internalToolbox.subscribeToResize(({ width, height, top, left, marginSize }) => {
		internalUniverse.setSize(width, height)
		internalUniverse.container.position.x = left - marginSize
		internalUniverse.container.position.y = top - marginSize
		tellTheKids('parent resize', { width, height })
	})

	const addChild = (...props) => internalUniverse.addChild(...props)
	const removeChild = (...props) => internalUniverse.removeChild(...props)

	return {
		...internalToolbox,
		addChild, // overwrites toolbox,
		removeChild // overwrites toolbox
	}
}