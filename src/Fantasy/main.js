import * as PIXI from "pixi.js"
import "pixi-layers"

const { Application, display } = PIXI
const { Stage } = display

import { Universe } from "./app"

const App = new Application({
	sharedTicker:true,
	sharedLoader:true,
})

const U = new Universe({
	children: [
		{
			kind: "Toolbox",
			x: 100,
			y: 100,
			w: 500,
			h: 300,
			children: [
				{
					kind:"Universe",
					x: 100,
					y: 100,
				}
			]
		}
	]
})

const sizerFn = () => {
	const { renderer, view } = App
	if((view.width !== view.clientWidth) || (view.height !== view.clientHeight)){
		renderer.resize(view.clientWidth, view.clientHeight, false)
		U.container.emit("layout", {w:view.clientWidth, h:view.clientHeight})
	}
}

App.ticker.remove(sizerFn)
App.ticker.add(sizerFn)

App.stage = new Stage()
App.stage.group.enableSort = true
App.stage.addChild(U.container)

document.body.appendChild(App.view)

document.addEventListener("keypress", function (e) {
	const { charCode } = e
	switch (charCode) {
		case 0: {
			toggleFullScreen()
			break;
		}
		case 32: {
			console.log("Refresh")
			location.reload()
			break;
		}
		default: {
			console.log(`charCode:${charCode}`)
			console.log(e)
		}
	}

}, false)

const toggleFullScreen = () => {
	if (!document.fullscreenElement) {
		App.view.requestFullscreen()
	} else if (document.exitFullscreen) {
		document.exitFullscreen()
	}
}