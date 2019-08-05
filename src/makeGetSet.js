export const makeGetSet = ({initialValue}) => {
	let value = initialValue
	let subscribers = new Set()
	const getValue = () => value
	const setValue = newValue => {
		value = newValue
		subscribers.forEach(sub => { sub(newValue) })
	}
	const subscribe = callback => {
		if (subscribers.has(callback) === false) {
			subscribers.add(callback)
			callback(initialValue)
		}
		return () => {

		}
	}

	return [getValue, setValue, subscribe]
}