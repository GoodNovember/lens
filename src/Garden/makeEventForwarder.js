export const makeEventForwarder = targetContainer => (eventName, payload) => targetContainer.children.forEach(child => { child.emit(eventName, payload) })
