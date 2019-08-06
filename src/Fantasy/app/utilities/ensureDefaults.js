import { isObj } from "./assertions"

const extend = (defaults) => (anotherObject) => {
	if (isObj(defaults) && isObj(anotherObject)) {
		return Object.assign({}, defaults, anotherObject)
	} else {
		if (isObj(defaults) === false) {
			console.error("Default object is not an object.", defaults)
		} else if (isObj(anotherObject) === false) {
			console.error("Other object is not an object", anotherObject)
		}
	}
}

export const ensureDefaults = (ingredients, defaults) => ((isObj(ingredients))?(extend(defaults)(ingredients)):(defaults))