import * as PIXI from "pixi.js"
import "pixi-layers"

import * as KNOWN_KINDS from "../index.js"

const { display, Graphics } = PIXI
const { Layer, Stage } = display

import {
	cursors,
	makeRect,
	ensureDefaults,
	enableDragEvents
} from "../utilities"

const TOOLBOX_MIN_WIDTH = 32
const TOOLBOX_MIN_HEIGHT = 32

const INNER_MARGIN = 32

const MARGIN_SIZE = 8
const CORNER_SIZE = 16

const HALF_MARGIN_SIZE = MARGIN_SIZE / 2

const CORNER_COLOR = 0x999999 // 0xaaaaaa
const EDGE_COLOR = 0x999999 // 0xeeeeee
const BG_COLOR = 0xbbbbbb // 0x999999

const DRAGGING_ALPHA = 0.75

export class Toolbox{
	constructor(ingredients) {

		const self = this

		const defaults = {
			name: 'unnamed-toolbox',
			x: 0,
			y: 0,
			w: TOOLBOX_MIN_WIDTH,
			h: TOOLBOX_MIN_HEIGHT,
			children: [],
			layout(width, height){}
		}

		const args = ensureDefaults(ingredients,defaults)

		const { universe } = ingredients

		self.kind = "Toolbox"
		self.universe = universe

		self.debugGraphics = new Graphics()

		const container = new Stage()
		self.container = container

		const chromeLayer = new Layer()
		container.addChild(chromeLayer)

		const internalPartsLayer = new Layer()
		container.addChild(internalPartsLayer)

		self.internalPartsLayer = internalPartsLayer

		self.name = args.name
		self.x = args.x
		self.y = args.y
		self.w = args.w
		self.h = args.h
		self.children = args.children
		self.layout = args.layout

		internalPartsLayer.x = INNER_MARGIN + MARGIN_SIZE
		internalPartsLayer.y = INNER_MARGIN + MARGIN_SIZE
		

		// Draw Chrome

		// Main Mover
		self.chromeMover = enableDragEvents(makeRect({
			x: MARGIN_SIZE,
			y: MARGIN_SIZE,
			w: self.w - ( MARGIN_SIZE * 2 ),
			h: self.h - ( MARGIN_SIZE * 2 ),
			tint: BG_COLOR,
			interactive: true,
			cursor: cursors.MOVE
		}))	

		self.chromeMover.on('dragging', ({ pointerState }) => {
			const { startDelta } = pointerState
			const { x, y } = startDelta
			self.moveBy(x, y)
			self.drawMask()
			self.tellTheKids("parent moved")
		}).on('dragstart', () => {
			container.alpha = DRAGGING_ALPHA
			self.bringToFront()
		}).on('dragend',()=>{
			container.alpha = 1
		})

		// Resize Bars
		self.chromeTopSizer = enableDragEvents(makeRect({
			x: CORNER_SIZE,
			y: 0,
			w: this.w - ( CORNER_SIZE * 2 ),
			h: MARGIN_SIZE,
			cursor: cursors.NS_RESIZE,
			tint: EDGE_COLOR,
		}))
		self.chromeLeftSizer = enableDragEvents(makeRect({
			x: 0,
			y: CORNER_SIZE,
			w: MARGIN_SIZE,
			h: this.h - ( CORNER_SIZE * 2 ),
			cursor: cursors.EW_RESIZE,
			tint: EDGE_COLOR,
		}))
		self.chromeRightSizer = enableDragEvents(makeRect({
			x: this.w - ( MARGIN_SIZE * 1 ),
			y: CORNER_SIZE,
			w: MARGIN_SIZE,
			h: this.h - ( CORNER_SIZE * 2) ,
			cursor: cursors.EW_RESIZE,
			tint: EDGE_COLOR,
		}))
		self.chromeBottomSizer = enableDragEvents(makeRect({
			x: CORNER_SIZE,
			y: this.h - ( MARGIN_SIZE * 1 ),
			w: this.w - ( CORNER_SIZE * 2 ),
			h: MARGIN_SIZE,
			cursor: cursors.NS_RESIZE,
			tint: EDGE_COLOR,
		}))

		self.chromeTopSizer.on('dragging', ({ dx, dy, my, pointerState }) => {
			const { current } = pointerState
			const { y } = current
			self.moveTopEdgeTo( y )
			self.tellTheKids('parent moved')
			self.drawMask()
			self.layout()
		}).on('dragstart',()=>{
			self.bringToFront()
		})

		self.chromeLeftSizer.on('dragging', ({ dx, dy, mx, pointerState }) => {
			const { current } = pointerState
			const { x } = current
			self.moveLeftEdgeTo(x)
			self.tellTheKids('parent moved')
			self.drawMask()
			self.layout()
		}).on('dragstart',()=>{
			self.bringToFront()
		})

		self.chromeRightSizer.on('dragging', ({ dx, dy, mx, pointerState }) => {
			const { current } = pointerState
			const { x } = current
			self.moveRightEdgeTo( x )
			self.tellTheKids('parent moved')
			self.drawMask()
			self.layout()
		}).on('dragstart',()=>{
			self.bringToFront()
		})

		self.chromeBottomSizer.on('dragging', ({ dx, dy, my, pointerState }) => {
			const { current } = pointerState
			const { y } = current
			self.moveBottomEdgeTo( y )
			self.tellTheKids('parent moved')
			self.drawMask()
			self.layout()
		}).on('dragstart',()=>{
			self.bringToFront()
		})


		// Top Left Corner
		self.chromeTopLeftCornerTop = enableDragEvents(makeRect({
			x: MARGIN_SIZE,
			y: 0,
			w: CORNER_SIZE - MARGIN_SIZE,
			h: MARGIN_SIZE,
			tint:CORNER_COLOR,
			cursor: cursors.NWSE_RESIZE,
		}))
		self.chromeTopLeftCornerLeft = enableDragEvents(makeRect({
			x: 0,
			y: MARGIN_SIZE,
			w: MARGIN_SIZE,
			h: CORNER_SIZE - MARGIN_SIZE,
			tint:CORNER_COLOR,
			cursor: cursors.NWSE_RESIZE,
		}))
		self.chromeTopLeftCornerTopLeft = enableDragEvents(makeRect({
			x: 0,
			y: 0,
			w: MARGIN_SIZE,
			h: MARGIN_SIZE,
			tint:CORNER_COLOR,
			cursor: cursors.NWSE_RESIZE,
		}))

		const moveTopLeft = ({ pointerState }) => {
			const { current } = pointerState
			const { x, y } = current
			self.moveTopEdgeTo( y )
			self.moveLeftEdgeTo(x)
			self.tellTheKids('parent moved')
			self.drawMask()
			self.layout()
		}

		self.chromeTopLeftCornerTop.on('dragging', moveTopLeft)
		self.chromeTopLeftCornerLeft.on('dragging', moveTopLeft)
		self.chromeTopLeftCornerTopLeft.on('dragging', moveTopLeft)

		// Top Right Corner
		self.chromeTopRightCornerTop = enableDragEvents(makeRect({
			x: this.w - ( CORNER_SIZE * 1 ),
			y: 0,
			w: CORNER_SIZE - MARGIN_SIZE,
			h: MARGIN_SIZE,
			tint: CORNER_COLOR,
			cursor: cursors.NESW_RESIZE,
		}))
		self.chromeTopRightCornerRight = enableDragEvents(makeRect({
			x: this.w - ( MARGIN_SIZE * 1 ),
			y: MARGIN_SIZE,
			w: MARGIN_SIZE,
			h: CORNER_SIZE - MARGIN_SIZE,
			tint: CORNER_COLOR,
			cursor: cursors.NESW_RESIZE,
		}))
		self.chromeTopRightCornerTopRight = enableDragEvents(makeRect({
			x: this.w - ( MARGIN_SIZE * 1 ),
			y: 0,
			w: MARGIN_SIZE,
			h: MARGIN_SIZE,
			tint: CORNER_COLOR,
			cursor: cursors.NESW_RESIZE,
		}))

		const moveTopRight = ({ pointerState }) => {
			const { current } = pointerState
			const { x, y } = current
			self.moveTopEdgeTo( y )
			self.moveRightEdgeTo(x)
			self.tellTheKids('parent moved')
			self.drawMask()
			self.layout()
		}

		self.chromeTopRightCornerTop.on('dragging', moveTopRight)
		self.chromeTopRightCornerRight.on('dragging', moveTopRight)
		self.chromeTopRightCornerTopRight.on('dragging', moveTopRight)

		// Bottom Left Corner
		self.chromeBottomLeftCornerLeft = enableDragEvents(makeRect({
			x: 0,
			y: this.h - ( CORNER_SIZE * 1 ),
			w: MARGIN_SIZE,
			h: ( CORNER_SIZE - MARGIN_SIZE ),
			tint: CORNER_COLOR,
			cursor: cursors.NESW_RESIZE,
		}))
		self.chromeBottomLeftCornerBottom = enableDragEvents(makeRect({
			x: MARGIN_SIZE,
			y: this.h - MARGIN_SIZE,
			w: ( CORNER_SIZE - MARGIN_SIZE ),
			h: MARGIN_SIZE,
			tint: CORNER_COLOR,
			cursor: cursors.NESW_RESIZE,
		}))
		self.chromeBottomLeftCornerBottomLeft = enableDragEvents(makeRect({
			x: 0,
			y: this.h - ( MARGIN_SIZE * 1 ),
			w: MARGIN_SIZE,
			h: MARGIN_SIZE,
			tint: CORNER_COLOR,
			cursor: cursors.NESW_RESIZE,
		}))

		const moveBottomLeft = ({ pointerState }) => {
			const { current } = pointerState
			const { x, y } = current
			self.moveBottomEdgeTo( y )
			self.moveLeftEdgeTo( x )
			self.tellTheKids( 'parent moved' )
			self.drawMask()
			self.layout()
		}

		self.chromeBottomLeftCornerLeft.on('dragging', moveBottomLeft)
		self.chromeBottomLeftCornerBottom.on('dragging', moveBottomLeft)
		self.chromeBottomLeftCornerBottomLeft.on('dragging', moveBottomLeft)

		// Bottom Right Corner
		self.chromeBottomRightCornerRight = enableDragEvents(makeRect({
			x: this.w - ( MARGIN_SIZE * 1 ),
			y: this.h - ( CORNER_SIZE * 1 ),
			w: MARGIN_SIZE,
			h: CORNER_SIZE - MARGIN_SIZE,
			tint: CORNER_COLOR,
			cursor: cursors.NWSE_RESIZE,
		}))
		self.chromeBottomRightCornerBottom = enableDragEvents(makeRect({
			x: this.w - ( CORNER_SIZE * 1 ),
			y: this.h - ( MARGIN_SIZE * 1 ),
			w: CORNER_SIZE - MARGIN_SIZE,
			h: MARGIN_SIZE,
			tint: CORNER_COLOR,
			cursor: cursors.NWSE_RESIZE,
		}))
		self.chromeBottomRightCornerBottomRight = enableDragEvents(makeRect({
			x: this.w - ( MARGIN_SIZE * 1 ),
			y: this.h - ( MARGIN_SIZE * 1 ),
			w: MARGIN_SIZE,
			h: MARGIN_SIZE,
			tint: CORNER_COLOR,
			cursor: cursors.NWSE_RESIZE,
		}))

		const moveBottomRight = ({ pointerState }) => {
			const { current } = pointerState
			const { x, y } = current
			self.moveRightEdgeTo( x )
			self.moveBottomEdgeTo( y )
			self.tellTheKids( 'parent moved' )
			self.drawMask()
			self.layout()
		}

		self.chromeBottomRightCornerRight.on( 'dragging', moveBottomRight )
		self.chromeBottomRightCornerBottom.on( 'dragging', moveBottomRight )
		self.chromeBottomRightCornerBottomRight.on( 'dragging', moveBottomRight )

		const chromeParts = [
			this.chromeMover,

			this.chromeTopSizer,
			this.chromeLeftSizer,
			this.chromeRightSizer,
			this.chromeBottomSizer,
			
			this.chromeTopLeftCornerTop,
			this.chromeTopLeftCornerLeft,
			this.chromeTopLeftCornerTopLeft,

			this.chromeTopRightCornerTop,
			this.chromeTopRightCornerRight,
			this.chromeTopRightCornerTopRight,

			this.chromeBottomLeftCornerLeft,
			this.chromeBottomLeftCornerBottom,
			this.chromeBottomLeftCornerBottomLeft,

			this.chromeBottomRightCornerRight,
			this.chromeBottomRightCornerBottom,
			this.chromeBottomRightCornerBottomRight,

			this.debugGraphics,
		]

		chromeParts.forEach( ( part ) => ( chromeLayer.addChild( part ) ) )
		
		//finally, we should add some children

		self.children.map((ingredients) => {
			const { kind } = ingredients
			if ( kind === self.kind ) {
				const instance = new Toolbox(ingredients)
				self.addChild( instance.container )
			} else {
				if (KNOWN_KINDS[kind]) {
					const instance = new KNOWN_KINDS[ kind ]( ingredients )
					self.addChild( instance.container )
				}else{
					console.error("TOOLBOX: Unknown Child Kind:", kind, ingredients)
				}
			}
		})

		// now we should draw our first mask.
		self.drawMask()
		// while also connecting to our universe's movement event
		self.container.on('parent moved', (...args) => {
			// draw our mask
			self.drawMask()
			// send the signal down to our children. There may yet be more universes down below.
			self.tellTheKids('parent moved',...args)
		})

		self.container.on("layout", ({ parent, w, h }) => {
			
		})

		this.layout()

	}

	layout() {

		const { BOUND_HEIGHT, BOUND_WIDTH } = this

		const parent = this
		const w = BOUND_WIDTH - (INNER_MARGIN * 2)
		const h = BOUND_HEIGHT - (INNER_MARGIN * 2)

		this.internalPartsLayer.children.map((child)=>(child.emit('layout', { parent, w, h })))
	}

	drawMask() {

		const {
			GLOBAL_TOP_BOUNDS,
			GLOBAL_LEFT_BOUNDS,
			GLOBAL_RIGHT_BOUNDS,
			GLOBAL_BOTTOM_BOUNDS,
		} = this

		const mask = new Graphics()

		mask.beginFill()
		mask.drawRect(
			Math.min(GLOBAL_LEFT_BOUNDS, GLOBAL_RIGHT_BOUNDS) + INNER_MARGIN,
			Math.min(GLOBAL_TOP_BOUNDS, GLOBAL_BOTTOM_BOUNDS) + INNER_MARGIN,
			Math.max(Math.max(GLOBAL_LEFT_BOUNDS, GLOBAL_RIGHT_BOUNDS) - Math.min(GLOBAL_LEFT_BOUNDS, GLOBAL_RIGHT_BOUNDS) - (INNER_MARGIN * 2), 0),
			Math.max(Math.max(GLOBAL_TOP_BOUNDS, GLOBAL_BOTTOM_BOUNDS) - Math.min(GLOBAL_TOP_BOUNDS, GLOBAL_BOTTOM_BOUNDS) - (INNER_MARGIN * 2), 0),
		)
		mask.endFill()
		this.internalPartsLayer.mask = mask
	}
	get x() {
		return this.container.x
	}
	set x(value) {
		this.container.x = value
	}
	get y() {
		return this.container.y
	}
	set y(value) {
		return this.container.y = value
	}
	get w() {
		return this._w
	}
	set w(value) {
		const newWidth = Math.max(TOOLBOX_MIN_WIDTH, value)
		this._w = newWidth
	}
	get h() {
		return this._h
	}
	set h(value) {
		const newHeight = Math.max(TOOLBOX_MIN_HEIGHT, value)
		this._h = newHeight
	}
	get GLOBAL_TOP_BOUNDS() {
		return this.chromeTopSizer.getGlobalPosition().y + this.chromeTopSizer.height
	}
	get GLOBAL_LEFT_BOUNDS() {
		return this.chromeLeftSizer.getGlobalPosition().x + this.chromeLeftSizer.width
	}
	get GLOBAL_RIGHT_BOUNDS() {
		return this.chromeRightSizer.getGlobalPosition().x
	}
	get GLOBAL_BOTTOM_BOUNDS() {
		return this.chromeBottomSizer.getGlobalPosition().y
	}
	get TOP_BOUNDS() {
		return this.chromeTopSizer.y + MARGIN_SIZE
	}
	get LEFT_BOUNDS(){
		return this.chromeLeftSizer.x + MARGIN_SIZE
	}
	get RIGHT_BOUNDS() {
		return this.chromeRightSizer.x
	}
	get BOTTOM_BOUNDS() {
		return this.chromeBottomSizer.y
	}
	get BOUND_HEIGHT(){
		return this.BOTTOM_BOUNDS - this.TOP_BOUNDS
	}
	get BOUND_WIDTH(){
		return this.RIGHT_BOUNDS - this.LEFT_BOUNDS
	}
	get maskBounds() {

		const { TOP_BOUNDS, LEFT_BOUNDS, RIGHT_BOUNDS, BOTTOM_BOUNDS } = this

		const topLeftPoint = {
			x: LEFT_BOUNDS,
			y: TOP_BOUNDS,
		}

		const topRightPoint = {
			x: RIGHT_BOUNDS,
			y: TOP_BOUNDS,
		}

		const bottomLeftPoint = {
			x: LEFT_BOUNDS,
			y: BOTTOM_BOUNDS,
		}

		const bottomRightPoint = {
			x: RIGHT_BOUNDS,
			y: BOTTOM_BOUNDS,
		}

		return {
			topLeftPoint,
			topRightPoint,
			bottomLeftPoint,
			bottomRightPoint,
		}
	}
	get chromeLeftLineParts() {
		return [
			this.chromeLeftSizer,
			this.chromeTopLeftCornerLeft,
			this.chromeTopLeftCornerTopLeft,
			this.chromeBottomLeftCornerLeft,
			this.chromeBottomLeftCornerBottomLeft,
		]
	}
	get chromeRightLineParts() {
		return [
			this.chromeRightSizer,
			this.chromeTopRightCornerRight,
			this.chromeTopRightCornerTopRight,
			this.chromeBottomRightCornerRight,
			this.chromeBottomRightCornerBottomRight,
		]
	}
	get chromeBottomLineParts(){
		return [
			this.chromeBottomSizer,
			this.chromeBottomLeftCornerBottom,
			this.chromeBottomRightCornerBottom,
			this.chromeBottomLeftCornerBottomLeft,
			this.chromeBottomRightCornerBottomRight,
		]
	}
	get chromeTopLineParts() {
		return [
			this.chromeTopSizer,
			this.chromeTopLeftCornerTop,
			this.chromeTopRightCornerTop,
			this.chromeTopLeftCornerTopLeft,
			this.chromeTopRightCornerTopRight,
		]
	}
	tellTheKids(eventName, ...args) {
		this.internalPartsLayer.children.map( (child) => child.emit( eventName, ...args) )
	}
	debugDrawBounds() {
		const { TOP_BOUNDS, LEFT_BOUNDS, RIGHT_BOUNDS, BOTTOM_BOUNDS, debugGraphics } = this
		
		debugGraphics.lineStyle(1, 0xff0000, 1)

		debugGraphics.moveTo(LEFT_BOUNDS, TOP_BOUNDS)
		debugGraphics.lineTo(RIGHT_BOUNDS, TOP_BOUNDS)

		debugGraphics.moveTo(LEFT_BOUNDS, BOTTOM_BOUNDS)
		debugGraphics.lineTo(RIGHT_BOUNDS, BOTTOM_BOUNDS)

		debugGraphics.moveTo(LEFT_BOUNDS, TOP_BOUNDS)
		debugGraphics.lineTo(LEFT_BOUNDS, BOTTOM_BOUNDS)

		debugGraphics.moveTo(RIGHT_BOUNDS, TOP_BOUNDS)
		debugGraphics.lineTo(RIGHT_BOUNDS, BOTTOM_BOUNDS)
	}
	debugDrawMaskBounds() {
		const { maskBounds, debugGraphics } = this
		const {
			topLeftPoint,
			topRightPoint,
			bottomLeftPoint,
			bottomRightPoint,
		} = maskBounds

		debugGraphics.lineStyle(1, 0x00ffff, 1)
		
		debugGraphics
			.moveTo(topLeftPoint.x, topLeftPoint.y)
			.lineTo(topRightPoint.x, topRightPoint.y)
			.lineTo(bottomRightPoint.x, bottomRightPoint.y)
			.lineTo(bottomLeftPoint.x, bottomLeftPoint.y)
			.lineTo(topLeftPoint.x, topLeftPoint.y)

	}
	debugDrawV(x,color=0x00ff00) {
		this.debugGraphics.lineStyle(1, color, 1)
		this.debugGraphics.moveTo(x, -1000)
		this.debugGraphics.lineTo(x, 1000)
	}
	debugDrawH(y,color=0x00ff00) {
		this.debugGraphics.lineStyle(1, color, 1)
		this.debugGraphics.moveTo(-1000, y)
		this.debugGraphics.lineTo(1000, y)
	}
	moveTo(x, y) {
		this.container.x = x
		this.container.y = y
	}
	moveBy(dx, dy) {
		this.container.x += dx
		this.container.y += dy
	}
	moveLeftEdgeTo(x) {
		const { RIGHT_BOUNDS } = this

		const _MOVE_VALUE_	= x - HALF_MARGIN_SIZE
		const _FIXED_VALUE_	= RIGHT_BOUNDS - TOOLBOX_MIN_WIDTH + MARGIN_SIZE

		const newX = Math.min( _MOVE_VALUE_, _FIXED_VALUE_ )

		this.chromeLeftLineParts.map( ( part ) => { part.x = newX } )
		this.chromeTopLeftCornerTop.x		= newX + ( MARGIN_SIZE )
		this.chromeBottomLeftCornerBottom.x	= newX + ( MARGIN_SIZE )
		
		const { LEFT_BOUNDS, BOUND_WIDTH } = this

		this.chromeMover.x			= LEFT_BOUNDS
		this.chromeTopSizer.x		= LEFT_BOUNDS + (CORNER_SIZE - MARGIN_SIZE)
		this.chromeBottomSizer.x	= LEFT_BOUNDS + (CORNER_SIZE - MARGIN_SIZE)

		this.chromeMover.width			= BOUND_WIDTH
		this.chromeTopSizer.width		= BOUND_WIDTH - (CORNER_SIZE * 2) + (MARGIN_SIZE * 2)
		this.chromeBottomSizer.width	= BOUND_WIDTH - (CORNER_SIZE * 2) + (MARGIN_SIZE * 2)

		this.internalPartsLayer.x = LEFT_BOUNDS + MARGIN_SIZE + INNER_MARGIN
	}
	moveRightEdgeTo(x) {
		const { LEFT_BOUNDS } = this
		const _MOVE_VALUE_	= x - HALF_MARGIN_SIZE
		const _FIXED_VALUE_	= LEFT_BOUNDS + TOOLBOX_MIN_WIDTH - ( MARGIN_SIZE * 2 )

		const newX = Math.max( _MOVE_VALUE_, _FIXED_VALUE_ )

		this.chromeRightLineParts.map( ( part ) => { part.x = newX } )
		this.chromeTopRightCornerTop.x			= newX - ( CORNER_SIZE - MARGIN_SIZE )
		this.chromeBottomRightCornerBottom.x	= newX - ( CORNER_SIZE - MARGIN_SIZE )

		const { BOUND_WIDTH } = this

		this.chromeMover.x			= LEFT_BOUNDS
		this.chromeTopSizer.x		= LEFT_BOUNDS + ( CORNER_SIZE - MARGIN_SIZE )
		this.chromeBottomSizer.x	= LEFT_BOUNDS + ( CORNER_SIZE - MARGIN_SIZE )

		this.chromeMover.width			= BOUND_WIDTH
		this.chromeTopSizer.width		= BOUND_WIDTH - ( CORNER_SIZE * 2 ) + ( MARGIN_SIZE * 2 )
		this.chromeBottomSizer.width = BOUND_WIDTH - (CORNER_SIZE * 2) + (MARGIN_SIZE * 2)
	}
	moveTopEdgeTo(y) {
		const { BOTTOM_BOUNDS } = this
		const _MOVE_VALUE_		= y - HALF_MARGIN_SIZE
		const _FIXED_VALUE_ = BOTTOM_BOUNDS - MARGIN_SIZE - TOOLBOX_MIN_HEIGHT + (MARGIN_SIZE * 2)
		
		const newY = Math.min( _MOVE_VALUE_, _FIXED_VALUE_ )

		this.chromeTopLineParts.map((part)=>{ part.y = newY })
		this.chromeTopLeftCornerLeft.y		= newY + ( MARGIN_SIZE )
		this.chromeTopRightCornerRight.y	= newY + ( MARGIN_SIZE )
		
		const { BOUND_HEIGHT, TOP_BOUNDS } = this

		this.chromeMover.height			= BOUND_HEIGHT
		this.chromeLeftSizer.height		= BOUND_HEIGHT - ( CORNER_SIZE * 2 ) + ( MARGIN_SIZE * 2 )
		this.chromeRightSizer.height	= BOUND_HEIGHT - ( CORNER_SIZE * 2 ) + ( MARGIN_SIZE * 2 )

		this.chromeMover.y		= TOP_BOUNDS
		this.chromeLeftSizer.y	= TOP_BOUNDS + ( CORNER_SIZE - MARGIN_SIZE )
		this.chromeRightSizer.y = TOP_BOUNDS + ( CORNER_SIZE - MARGIN_SIZE )

		this.internalPartsLayer.y = TOP_BOUNDS + MARGIN_SIZE + INNER_MARGIN
	}
	moveBottomEdgeTo(y) {
		const { TOP_BOUNDS }	= this
		const _MOVE_VALUE_		= y - HALF_MARGIN_SIZE
		const _FIXED_VALUE_		= ( TOOLBOX_MIN_HEIGHT - ( MARGIN_SIZE * 2 ) ) + TOP_BOUNDS

		const newY = Math.max( _MOVE_VALUE_, _FIXED_VALUE_ )

		this.chromeBottomLineParts.map( ( part ) => { part.y = newY } )
		this.chromeBottomLeftCornerLeft.y	= newY - ( CORNER_SIZE - MARGIN_SIZE )
		this.chromeBottomRightCornerRight.y = newY - ( CORNER_SIZE - MARGIN_SIZE )
		
		const { BOUND_HEIGHT } = this 

		this.chromeMover.height			= BOUND_HEIGHT
		this.chromeLeftSizer.height		= BOUND_HEIGHT - ( CORNER_SIZE * 2 ) + ( MARGIN_SIZE * 2 )
		this.chromeRightSizer.height	= BOUND_HEIGHT - ( CORNER_SIZE * 2 ) + ( MARGIN_SIZE * 2 )

		this.chromeMover.y		= TOP_BOUNDS
		this.chromeLeftSizer.y	= TOP_BOUNDS + ( CORNER_SIZE - MARGIN_SIZE )
		this.chromeRightSizer.y = TOP_BOUNDS + (CORNER_SIZE - MARGIN_SIZE)
	}
	sendToBack() {
		this.container.zIndex = -1
		this.reorderZindexes()
	}
	bringToFront(){
		this.container.zIndex = this.container.parent.children.length
		this.reorderZindexes()
	}
	reorderZindexes() {
		this.container.parent.children
			.sort( ( a, b ) => ( a.zIndex - b.zIndex ) )
			.map( ( child, index ) => ( child.zIndex = ( child.zIndex !== index ) ? ( index ) : ( child.zIndex ) ) )
	}
	addChild(...args) {
		this.internalPartsLayer.addChild(...args)
	}
	removeChild(...args) {
		this.internalPartsLayer.removeChild(...args)
	}
}