// import * as PIXI from 'pixi.js'
import { createSizer } from './createSizer.js'
import { Container } from "pixi.js"

import { Universe } from '../Fantasy/app/'

export const boot = ({ App }) => {
  const { stage } = App

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
	]})

  stage.addChild(U.container)
}
