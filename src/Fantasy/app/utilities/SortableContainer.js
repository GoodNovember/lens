import { Container } from "pixi.js"

let tmpArrivalOrder = 0
let tmpChanged = []
let tmpOld = []

export class SortableContainer extends Container{
	addChildZ(child, zOrder) {
		child.zOrder = zOrder || 0
		child.oldZOrder = Infinity
		child.arrivalOrder = ++tmpArrivalOrder
		super.addChild(child)
	}
	sortChildren() {
		const children = this.children
    
		let len = children.length
		for (let i = 0; i < len; i++) {
		  const elem = children[i]
		 
		  if (elem.zOrder !== elem.oldZOrder) {
			tmpChanged.push(elem)
		  } else {
			tmpOld.push(elem)
		  }
		  elem.oldZOrder = elem.zOrder
		}
		
		if (tmpChanged.length === 0) {
		  tmpOld.length = 0
		  return
		}
		if (tmpChanged.length > 1) {
		  tmpChanged.sort(comparison)
		}
		
		let j = 0, a = 0, b = 0;
		while (a < tmpChanged.length && b < tmpOld.length) {
		  if (comparison(tmpChanged[a], tmpOld[b]) < 0) {
			children[j++] = tmpChanged[a++]
		  } else {
			children[j++] = tmpOld[b++]
		  }
		}
		while (a < tmpChanged.length) {
		  children[j++] = tmpChanged[a++]
		}
		while (b < tmpOld.length) {
		  children[j++] = tmpOld[b++]
		}
		
		tmpChanged.length = 0
		tmpOld.length = 0
	}
}

const comparison = (a, b) => {
	if (a.zOrder > b.zOrder) return 1
	if (a.zOrder < b.zOrder) return -1
	if (a.arrivalOrder > b.arrivalOrder) return 1
	if (b.arrivalOrder < a.arrivalOrder) return -1
	return 0
}