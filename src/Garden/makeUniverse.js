import { enableDragEvents } from './enableDragEvents.js'
import { makeEventForwarder } from './makeEventForwarder.js'
import * as PIXI from 'pixi.js'
global.PIXI = PIXI
require('pixi-layers')

const {
  display,
  Graphics,
  TilingSprite
} = PIXI

const { Layer, Stage } = display

const GRID_SIZE = 25

export const makeUniverse = ({ }) => {
	const container = new Stage()

	const cvs = document.createElement('canvas')
	const ctx = cvs.getContext('2d')

	const mode = 'BOTH'

	cvs.width = GRID_SIZE
	cvs.height = GRID_SIZE
	ctx.beginPath()
	ctx.strokeStyle = 'magenta'
	ctx.lineWidth = 1
	ctx.moveTo(0, 0)
	ctx.lineTo(GRID_SIZE, 0)
	ctx.moveTo(0, 0)
	ctx.lineTo(0, GRID_SIZE)
	ctx.stroke()

	const backroundLayer = new Layer()
	container.addChild(backroundLayer)

	const gridTexture = enableDragEvents(TilingSprite.from(cvs, 250, 250))
	// gridTexture.anchor.set(0.5, 0.5)
	backroundLayer.addChild(gridTexture)

	const internalContainer = new Layer()
	internalContainer.group.enableSort = true
	container.addChild(internalContainer)
	
	const tellTheKids = makeEventForwarder(internalContainer)

	const setSize = (width, height) => {
		gridTexture.width = width
		gridTexture.height = height
		tellTheKids('parent resize')({width, height})
	}

	const addChild = (...args) => {
		internalContainer.addChild(...args)
	}

	container.on('parent resized', (...props) => {
		tellTheKids('parent resized')(...props)
	})

	container.on('parent moved', (...props) => {
		tellTheKids('parent moved')(...props)
	})

	gridTexture.on('dragging', ({ reference: { x, y } }) => {
		let changeOccured = false
		const setX = x => {
			internalContainer.position.x = x
			gridTexture.tileTransform.position.x = x
		}
		const setY = y => {
			internalContainer.position.y = y
			gridTexture.tileTransform.position.y = y
		}
		if (mode === 'BOTH') {
			if (internalContainer.position.x !== x) {
				setX(x)
				changeOccured = true
			}
			if (internalContainer.position.y !== y) {
				setY(y)
				changeOccured = true
			}
		} else if (mode === 'X_ONLY') {
			if (internalContainer.position.x !== x) {
				setX(x)
				changeOccured = true
			}
		} else if (mode === 'Y_ONLY') {
			if (internalContainer.position.y !== y) {
				setY(y)
				changeOccured = true
			}
		}
		if (changeOccured === true) {
			tellTheKids('parent moved')({ x, y })
		}
	})

	const emit = (eventName, payload) => {
		tellTheKids(eventName)(payload)
	}

	const on = (eventName, callback) => {
		container.on(eventName, callback)
	}

	return {
		container,
		addChild,
		setSize,
		emit,
		on
	}
}