import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { lerp } from '../Utilities/lerp.js'
import { makePlate } from '../Parts/makePlate.js'
import { makeRect } from '../Utilities/makeRect.js'
import { makeText } from '../Parts/makeText.js'

export const makeUserMediaTray = ({
  x,
  y,
  name = 'unnamed User Media Tray'
}) => {
  const plate = makePlate({
    x,
    y,
    width: 100,
    height: 300
  })

  const { container } = plate

  const renderedItems = new Set()

  const userButton = makeRect({
    x: 8,
    y: 8,
    width: 100 - 16,
    height: 32,
    tint: 0xffff00,
    interactive: true
  })

  container.addChild(userButton)

  const eraseExistingItems = () => {
    for (const item of renderedItems) {
      plate.removeChild(item)
    }
    renderedItems.clear()
  }

  const visualizeDevices = ({ groups }) => {
    eraseExistingItems()
    let groupIndex = 0
    const renderInput = (input, inputIndex, groupIndex) => {
      const x = 10
      const y = (((groupIndex * 5) + inputIndex) * 18) + 50
      const rect = makeRect({ x, y, width: 16, height: 16 })
      renderedItems.add(rect)
      plate.addChild(rect)
    }
    const renderGroup = (group, groupIndex) => {
      const { groupId, devices } = group
      const { audio, video } = devices
      const { inputs, outputs } = audio
      let inputIndex = 0
      for (const input of inputs) {
        renderInput(input, inputIndex, groupIndex)
        inputIndex++
      }
    }
    for (const group of groups) {
      renderGroup(group, groupIndex)
      groupIndex++
    }
  }

  const queryDeviceData = () => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const groupsRawObject = devices.reduce((acc, device) => {
        const { groupId, deviceId } = device
        if (!acc[groupId]) {
          acc[groupId] = []
        }
        if (deviceId === 'default') {
          if (!acc.defaults) {
            acc.defaults = []
          }
          acc.defaults.push(device)
        }
        acc[groupId].push(device)
        return acc
      }, {})
      const groups = Object.keys(groupsRawObject).reduce((acc, groupId) => {
        const devices = groupsRawObject[groupId].reduce((acc, device) => {
          const { kind } = device
          if (kind.indexOf('audio') >= 0) {
            if (kind === 'audioinput') {
              acc.audio.inputs.push(device)
            } else if (kind === 'audiooutput') {
              acc.audio.outputs.push(device)
            } else {
              acc.audio.others.push(device)
            }
          }
          if (kind.indexOf('video') >= 0) {
            if (kind === 'videoinput') {
              acc.video.inputs.push(device)
            } else if (kind === 'videooutput') {
              acc.video.outputs.push(device)
            } else {
              acc.video.others.push(device)
            }
          }
          return acc
        }, { audio: { inputs: [], outputs: [] }, video: { inputs: [], outputs: [] } })
        acc.push({ groupId, devices })
        return acc
      }, [])
      visualizeDevices({ groups })
    })
  }

  userButton.on('pointerdown', () => {
    userButton.once('pointerup', () => {
      queryDeviceData()
    })
  })

  queryDeviceData()

  return {
    container
  }
}
