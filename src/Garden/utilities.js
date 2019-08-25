export const removeAllChildrenFromContainer = container => {
	container.children.forEach(child => { container.removeChild(child) })
}