
import { Sprite, Texture } from "pixi.js"

const { WHITE } = Texture

export const makeRect = ({ x, y, w, h, tint, interactive, cursor }) => {
	const rect = new Sprite(WHITE)
	rect.width = w
	rect.height = h
	rect.x = x
	rect.y = y
	rect.tint = (tint) ? (tint) : (0xFFFFFF)
	rect.interactive = (interactive) ? (true) : (false)
	rect.cursor = (cursor) ? (cursor) : (rect.cursor)
	return rect
}