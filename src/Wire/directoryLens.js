import { makeUniversalToolbox } from '../Garden/makeUniversalToolbox.js'
import { parseDirectory } from './parseDirectory.js'

export const directoryLens = ({
	directory: initialDirectory = '~'
}) => {
	let directory = initialDirectory
	const universalToolbox = makeUniversalToolbox({
		x: 20,
		y: 100,
		width: 600,
		height: 400
	})
	const clearDirectory = () => {
		universalToolbox.clearChildren()
	}
	const renderDirectory = directoryPath => {
		const activeParsedDirectoryPath = parseDirectory(directory)
		universalToolbox.addChild(activeParsedDirectoryPath.container)
	}
	if (initialDirectory) {
		renderDirectory(initialDirectory)
	}
	return {
		...universalToolbox,
		get directory() { return directory },
		set directory(value) {
			directory = value
			clearDirectory()
			if (directory) {
				renderDirectory(value)
			}
		}
	}
}