import { makeUniversalToolbox } from './makeUniversalToolbox.js'
import { makeText } from './makeText.js'

export const makeListBox = ({
  ...toolboxProps
}) => {
  const removableArray = []
  const clickListeners = new Set()

  const universalToolbox = makeUniversalToolbox({
    ...toolboxProps
  })

  const notifyClickListeners = payload => {
    clickListeners.forEach(listener => listener(payload))
  }

  const COMFORT_MARGIN = 8

  const handleNewValue = arrayOfStrings => {
    removableArray.forEach(remover => remover())
    removableArray.length = 0
    arrayOfStrings.forEach((item, index) => {
      if (typeof item === 'string') {
        const labelItem = makeText(item)
        labelItem.y = (index * labelItem.height) + COMFORT_MARGIN
        labelItem.x = COMFORT_MARGIN
        labelItem.on('click', () => {
          notifyClickListeners(item)
        })
        const removeItem = universalToolbox.addChild(labelItem)
        removableArray.push(removeItem)
      } else {
        const { label, value } = item
        if (typeof label === 'string') {
          const labelItem = makeText(label)
          labelItem.y = (index * labelItem.height) + COMFORT_MARGIN
          labelItem.x = COMFORT_MARGIN
          labelItem.on('click', () => {
            notifyClickListeners(value)
          })
          const remover = universalToolbox.addChild(labelItem)
          removableArray.push(remover)
        }
      }
    })
  }

  const subscribeToClick = callback => {
    if (clickListeners.has(callback) === false) {
      clickListeners.add(callback)
    }
    return () => {
      if (clickListeners.has(callback)) {
        clickListeners.delete(callback)
      }
    }
  }

  return {
    ...universalToolbox,
    subscribeToClick,
    updateList (newArray) {
      universalToolbox.resetPosition()
      handleNewValue(newArray)
    }
  }
}
