// import * as PIXI from 'pixi.js'
import { createSizer } from './createSizer.js'
import { Container } from "pixi.js"

export const boot = ({ App }) => {
  const { stage } = App

  const myFancyContainer = new Container()

  const sizer = createSizer({
    width: 200,
    height: 200,
    innerContainer: myFancyContainer
  })

  stage.addChild(sizer.container)
}
