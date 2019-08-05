import { Container, Graphics } from "pixi.js"
import { makeSimpleSprite } from './makeSimpleSprite'
import { makeGetSet } from '../makeGetSet'

const CORNER_THICKNESS = 12
const VISIBLE_THICKNESS = 12
const HANDLE_ALPHA = 0.25

const MultiplyMaker = a => b => a * b

const twice = MultiplyMaker(2)

export const createSizer = ({
	x: initialX = 16,
	y: initialY = 16,
	width: initialWidth = 100,
	height: initialHeight = 100,
	innerContainer = new Container(),
}) => {
	const g = new Graphics()

	const container = new Container()	
	
	const topSizerSprite = makeSimpleSprite()
	const bottomSizerSprite = makeSimpleSprite()
	const leftSizerSprite = makeSimpleSprite()
	const rightSizerSprite = makeSimpleSprite()
	const upperLeftSizerSprite = makeSimpleSprite()
	const upperRightSizerSprite = makeSimpleSprite()
	const lowerRightSizerSprite = makeSimpleSprite()
	const lowerLeftSizerSprite = makeSimpleSprite()

	const [getCustomX, setCustomX, subToXChange] = makeGetSet({ initialValue: initialX })
	const [getCustomY, setCustomY, subToYChange] = makeGetSet({ initialValue: initialY })
	const [getCustomWidth, setCustomWidth, subToWidthChange] = makeGetSet({ initialValue: initialHeight })
	const [getCustomHeight, setCustomHeight, subToHeightChange] = makeGetSet({ initialValue: initialWidth })
	const [getCornerThickness, setCornerThickness, subToCornerThicknessChange] = makeGetSet({ initialValue:CORNER_THICKNESS })
	const [getVisibleThickness, setVisibleThickness, subToVisibileThicknessChange] = makeGetSet({ initialValue:VISIBLE_THICKNESS })
	const [getHandleAlpha, setHandleAlpha, subToHandleAlphaChange] = makeGetSet({ initialValue: HANDLE_ALPHA })

	const drawOutline = ({ width, height }) => { 
		g.clear()
		g.lineStyle(1, 0xFF0000, 1.0, 0.5, false)
		g.drawRect(0,0,width,height)
	 }

	subToXChange(newX => container.x = newX)
	subToYChange(newY => container.y = newY)
	
	subToWidthChange(newWidth => {
		topSizerSprite.width = (newWidth) - twice(getCornerThickness())
		bottomSizerSprite.width = (newWidth) - twice(getCornerThickness())
		rightSizerSprite.x = (newWidth) - (getVisibleThickness())
		upperRightSizerSprite.x = (newWidth) - (getCornerThickness())
		lowerRightSizerSprite.x = (newWidth) - (getCornerThickness())
		drawOutline({ width:newWidth, height:getCustomHeight() })
	})
	
	subToHeightChange(newHeight => {
		bottomSizerSprite.y = (newHeight) - (getVisibleThickness())
		leftSizerSprite.height = (newHeight) - twice(getCornerThickness())
		rightSizerSprite.height = (newHeight) - twice(getCornerThickness())
		lowerRightSizerSprite.y = (newHeight) - (getCornerThickness())
		lowerLeftSizerSprite.y = (newHeight) - (getCornerThickness())
		drawOutline({ width:getCustomWidth(), height:newHeight })
	})

	subToCornerThicknessChange(newCornerThickness => {
		const customWidth = getCustomWidth()
		const customHeight = getCustomHeight()
		const twiceNewCornerThickness = twice(newCornerThickness)
		topSizerSprite.x = newCornerThickness
		bottomSizerSprite.x = newCornerThickness
		leftSizerSprite.y = newCornerThickness
		rightSizerSprite.y = newCornerThickness
		upperLeftSizerSprite.height = newCornerThickness
		upperLeftSizerSprite.width = newCornerThickness
		upperRightSizerSprite.height = newCornerThickness
		upperRightSizerSprite.width = newCornerThickness
		lowerRightSizerSprite.height = newCornerThickness
		lowerRightSizerSprite.width = newCornerThickness
		lowerLeftSizerSprite.height = newCornerThickness
		lowerLeftSizerSprite.width = newCornerThickness
		upperRightSizerSprite.x = (customWidth) - (newCornerThickness)
		lowerRightSizerSprite.x = (customWidth) - (newCornerThickness)
		lowerLeftSizerSprite.y = (customHeight) - (newCornerThickness)
		lowerRightSizerSprite.y = (customHeight) - (newCornerThickness)
		topSizerSprite.width = (customWidth) - twiceNewCornerThickness
		bottomSizerSprite.width = (customWidth) - twiceNewCornerThickness
		leftSizerSprite.height = (customHeight) - twiceNewCornerThickness
		rightSizerSprite.height = (customHeight) - twiceNewCornerThickness
	})

	subToVisibileThicknessChange(newVisibleThickness => {
		const customWidth = getCustomWidth()
		const customHeight = getCustomHeight()
		topSizerSprite.height = newVisibleThickness
		leftSizerSprite.width = newVisibleThickness
		rightSizerSprite.width = newVisibleThickness
		bottomSizerSprite.height = newVisibleThickness
		rightSizerSprite.x = (customWidth) - (newVisibleThickness)
		bottomSizerSprite.y = (customHeight) - (newVisibleThickness)
	})

	subToHandleAlphaChange(newHandleAlpha => {
		topSizerSprite.alpha = newHandleAlpha
		leftSizerSprite.alpha = newHandleAlpha
		rightSizerSprite.alpha = newHandleAlpha
		bottomSizerSprite.alpha = newHandleAlpha
		upperLeftSizerSprite.alpha = newHandleAlpha
		lowerLeftSizerSprite.alpha = newHandleAlpha
		upperRightSizerSprite.alpha = newHandleAlpha
		lowerRightSizerSprite.alpha = newHandleAlpha
	})

	container.addChild(innerContainer)
	container.addChild(g)
	container.addChild(topSizerSprite)
	container.addChild(leftSizerSprite)
	container.addChild(rightSizerSprite)
	container.addChild(bottomSizerSprite)
	container.addChild(upperLeftSizerSprite)
	container.addChild(lowerLeftSizerSprite)
	container.addChild(upperRightSizerSprite)
	container.addChild(lowerRightSizerSprite)

	const publicInterface =  {
		container,
		get x() { return getCustomX() },
		set x(value) { setCustomX(value) },
		get y(){ return getCustomY() },
		set y(value) { setCustomY(value) },
		get width() { return getCustomWidth() },
		set width(value) { setCustomWidth(value) },
		get height() { return getCustomHeight() },
		set height(value) { setCustomHeight(value) }
	}

	return publicInterface
}