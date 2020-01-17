import { makeJack } from '../Anatomy/makeJack.js'
import { connectorValidator } from './validators/connectorValidator.js'
import { lerp } from '../Utilities/lerp.js'
import { makePlate } from '../Parts/makePlate.js'
import { makeRect } from '../Utilities/makeRect.js'
import { makeText } from '../Parts/makeText.js'

const iterate = ({ collection, fn, ...rest }) => {
  let index = 0
  let previousValue = null
  const output = []
  for (const item of collection) {
    const value = fn({ item, collection, index, previousValue, ...rest })
    previousValue = value
    output.push(value)
    index++
  }
  return output
}

export const makeUserMediaTray = ({
  x,
  y,
  name = 'unnamed User Media Tray',
  universe
}) => {
  const plate = makePlate({
    x,
    y,
    width: 100,
    height: 300,
    tint: 0x005588
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
    const renderInput = ({ item, collection, index, groupIndex }) => {
      const { label } = item
      const x = 10
      const y = (((groupIndex * 5) + index) * 18) + 50
      const rect = makeRect({ x, y, width: 16, height: 16, tint: 0x0000ff })
      const labelElement = makeText(label)
      labelElement.tint = 0x00ffff
      labelElement.x = x + 20
      labelElement.y = y
      labelElement.interactive = false

      console.log(item)
      makeJack({
        x: x,
        y: y,
        themeImage: 'jackConnector',
        name: `[${name}](${item.deviceId + item.groupId})'s ${item.kind} Jack`,
        universe
      }).then(inputJack => {
        plate.addChild(labelElement)
        plate.addChild(rect)
        plate.addChild(inputJack.container)
        renderedItems.add(inputJack.container)
        renderedItems.add(rect)
        renderedItems.add(labelElement)
      })
    }
    const renderGroup = (group, groupIndex) => {
      const { groupId, devices } = group
      const { audio, video } = devices
      const { inputs: audioInputs, outputs } = audio
      iterate({
        collection: audioInputs,
        groupIndex,
        fn: renderInput
      })
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
