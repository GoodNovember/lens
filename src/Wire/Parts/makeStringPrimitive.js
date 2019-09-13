import { makeToolbox } from './makeToolbox.js'
import { PIXI } from '../Utilities/localPIXI.js'

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
  const toolbox = makeToolbox({
    width,
    height,
    hideBox: true,
    mode: 'X-ONLY',
    ...props
  })
  const container = toolbox.container

  const pixiTextElement = new Text(getValue(), regularText)

  container.addChild(pixiTextElement)

  const textAreaElm = document.createElement('input')
  textAreaElm.type = 'text'
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

  function updateTextArea (bounds) {
    textAreaElm.style.height = `${bounds.height - (bounds.innerMargin * 2)}px`
    textAreaElm.style.width = `${bounds.width - (bounds.innerMargin * 2)}px`
    textAreaElm.style.top = `${bounds.globalTop + bounds.innerMargin}px`
    textAreaElm.style.left = `${bounds.globalLeft + bounds.innerMargin}px`
  }

  toolbox.container.on('parent move', bounds => {
    updateTextArea(toolbox.bounds)
  })

  toolbox.container.on('parent resize', bounds => {
    updateTextArea(toolbox.bounds)
  })

  // toolbox.subscribeToMove(bounds => {
  //   updateTextArea(bounds)
  // })

  // toolbox.subscribeToResize(bounds => {
  //   updateTextArea(bounds)
  // })

  function getValue () { return internalValue }
  function setValue (newValue) {
    internalValue = newValue
    textAreaElm.value = newValue
    changeListeners.forEach(listener => listener(newValue))
  }

  function clearListeners () {
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
    toolbox,
    subscribeToValueChange,
    clearListeners,
    get value () { return getValue() },
    set value (value) { setValue(value) }
  }
}
