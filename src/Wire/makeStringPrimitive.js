import { makeToolbox } from '../Garden/makeToolbox.js'

import * as PIXI from 'pixi.js-legacy'

global.PIXI = PIXI
require('pixi-layers')

const {
  display,
  Text,
  TextStyle
} = PIXI

const {
  Layer
} = display

const regularText = new TextStyle({
  fill: 0xff00ff,
  fontSize: 12,
  fontFamily: 'fira code'
})

export const makeStringPrimitive = ({
  value,
  width = 400,
  height = 75,
  ...props
}) => {
  const changeListeners = new Set()

  let internalValue = value
  const toolbox = makeToolbox({ width, height, ...props })
  const container = toolbox.container

  // const textElement = new Text(value, regularText)

  const textAreaElm = document.createElement('input')
  textAreaElm.type = 'text'
  // textAreaElm.style.resize = 'none'
  textAreaElm.style.display = 'block'
  textAreaElm.style.position = 'fixed'
  textAreaElm.style.backgroundColor = 'white'
  textAreaElm.style.border = '1px solid black'
  textAreaElm.style.boxSizing = 'border-box'
  textAreaElm.style.fontSize = '0.7rem'
  textAreaElm.style.padding = '.25rem'
  textAreaElm.style.fontFamily = 'fira code'
  textAreaElm.style.outline = 'none'
  textAreaElm.style.opacity = 0.75
  textAreaElm.style.textAlign = 'center'
  textAreaElm.value = internalValue
  document.body.appendChild(textAreaElm)

  // toolbox.addChild(textElement)

  function moveTextAreaItem (bounds) {
    textAreaElm.style.top = `${bounds.globalTop + bounds.innerMargin}px`
    textAreaElm.style.left = `${bounds.globalLeft + bounds.innerMargin}px`
    textAreaElm.style.height = `${bounds.height - (bounds.innerMargin * 2)}px`
    textAreaElm.style.width = `${bounds.width - (bounds.innerMargin * 2)}px`
  }

  toolbox.subscribeToMove(bounds => {
    moveTextAreaItem(bounds)
  })

  toolbox.subscribeToResize(bounds => {
    moveTextAreaItem(bounds)
  })

  const getValue = () => { return internalValue }
  const setValue = newValue => {
    internalValue = newValue
    // textElement.text = newValue
    textAreaElm.innerText = newValue
    changeListeners.forEach(listener => listener(newValue))
  }

  const clearListeners = () => {
    changeListeners.clear()
  }

  const subscribeToValueChange = callback => {
    if (changeListeners.has(callback) === false) {
      changeListeners.add(callback)
      callback(getValue())
    }
    return () => {
      if (changeListeners.has(callback)) {
        changeListeners.delete(callback)
      }
    }
  }

  const textElementChangeHandler = (event) => {
    setValue(event.target.value)
  }

  textAreaElm.addEventListener('change', textElementChangeHandler)

  return {
    container,
    subscribeToValueChange,
    clearListeners,
    get value () { return getValue() },
    set value (value) { setValue(value) }
  }
}
