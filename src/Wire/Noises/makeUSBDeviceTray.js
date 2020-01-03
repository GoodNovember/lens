import { makePlate } from '../Parts/makePlate.js'
import usbDetect from 'usb-detection'
import { makeJack } from '../Anatomy/makeJack.js'
const SerialPort = require('serialport')
const { createInterface } = require('readline')
const uuid = require('uuid')

const makeMotionSensor = async ({
  path, x, y,
  name = 'unnamed Motion Sensor',
  universe
}) => {
  console.log('Making MotionSensor!')

  const proximityJack = await makeJack({
    name: `[${name}]'s proximity jack`,
    universe,
    x: 8,
    y: 8,
    kind: 'zero-to-one',
    themeImage: 'jackZeroToOne'
  })

  const ProximityMin = 0
  const ProximityMax = 255

  const plate = makePlate({
    x,
    y,
    width: 32,
    height: 32,
    tint: 0x00ff00
  })

  plate.addChild(proximityJack.container)

  const { container } = plate

  let internalProximity = 0
  let internalMode = null // we won't know till we recieve data

  const proximitySubscribers = new Set()
  const gestureSubscribers = new Set()

  const waitingRequests = new Map()

  const baudRate = 115200

  const serialPort = new SerialPort(path, {
    baudRate,
    autoOpen: false
  })

  const lineReader = createInterface({
    input: serialPort
  })

  const sendRequestToDevice = requestObject => new Promise((resolve, reject) => {
    const { id } = requestObject
    waitingRequests.set(id, { resolve, reject })
    const formattedPayload = JSON.stringify(requestObject) + '\r\n'
    const payload = Buffer.from(formattedPayload)
    serialPort.write(payload)
  })

  const handleResponseFromDevice = responseObject => {
    const { id, error, value } = responseObject
    if (waitingRequests.has(id)) {
      const waitingRequest = waitingRequests.get(id)
      waitingRequests.delete(id)
      const { resolve, reject } = waitingRequest
      if (error) {
        reject(error)
      } else {
        resolve(value)
      }
    }
  }

  const connect = () => new Promise((resolve, reject) => {
    serialPort.on('open', error => {
      if (error) {
        reject(error)
      } else {
        lineReader.on('line', d => {
          const data = JSON.parse(d.toString())
          const { type, name, detail } = data
          if (type === 'event') {
            if (name === 'proximity-data') {
              if (internalMode !== 'proximity') {
                internalMode = 'proximity'
              }
              broadcastProximity(detail.proximity)
            } else if (name === 'gesture') {
              if (internalMode !== 'gesture') {
                internalMode = 'gesture'
              }
              broadcastGesture(detail.type)
            } else if (name === 'error') {
              console.error(data)
            } else {
              console.log('unexpected name:', name)
            }
          } else if (type === 'rpc-response') {
            handleResponseFromDevice(data)
          } else {
            console.error('unexpected', data)
          }
        })
        resolve()
      }
    })
    serialPort.open()
  })

  const disconnect = () => {
    serialPort.close()
  }

  const broadcastProximity = value => {
    const normalizedValue = value / ProximityMax
    internalProximity = normalizedValue
    proximityJack.broadcastToConnections({
      x: normalizedValue
    })
    for (const subscriber of proximitySubscribers) {
      subscriber(normalizedValue)
    }
  }

  const broadcastGesture = value => {
    for (const subscriber of gestureSubscribers) {
      subscriber(value)
    }
  }

  const subscribeToProximityUpdates = callback => {
    if (proximitySubscribers.has(callback) === false) {
      proximitySubscribers.add(callback)
    }
    return () => {
      if (proximitySubscribers.has(callback)) {
        proximitySubscribers.delete(callback)
      }
    }
  }

  const subscribeToGestureUpdates = callback => {
    if (gestureSubscribers.has(callback) === false) {
      gestureSubscribers.add(callback)
    }
    return () => {
      if (gestureSubscribers.has(callback)) {
        gestureSubscribers.delete(callback)
      }
    }
  }

  const setToGestureMode = () => {
    console.log('setting to Gesture Mode!')
    const id = uuid.v4()
    const mode = 'gesture'
    const method = 'set-mode'
    const params = [{ mode }]
    const payload = {
      type: 'rpc-request',
      id,
      method,
      params
    }
    return sendRequestToDevice(payload)
  }

  const setToProximityMode = () => {
    console.log('setting to Proximity Mode!')
    const id = uuid.v4()
    const mode = 'proximity'
    const method = 'set-mode'
    const params = [{ mode }]
    const payload = {
      type: 'rpc-request',
      id,
      method,
      params
    }
    return sendRequestToDevice(payload)
  }

  const setPollingInterval = interval => {
    const hardcodedMin = 50 // will error if lower than this.
    const softCodedMax = 2147000000 // actual max is untested, but this equates to about a month and is valid.
    const normalizedValue = Math.min(softCodedMax, Math.max(hardcodedMin, interval))
    if (normalizedValue !== interval) {
      if (normalizedValue === hardcodedMin) {
        console.error('Interval provided is too low, setting to lowest acceptable interval.')
      } else {
        console.info('Interval provided is too high, see code comments for details. Setting to appropreate maximum.')
      }
    }
    const id = uuid.v4()
    const method = 'set-interval'
    const params = [{ interval: normalizedValue }] // should be in milliseconds
    const payload = {
      type: 'rpc-request',
      id,
      method,
      params
    }
    return sendRequestToDevice(payload)
  }

  return {
    get proximity() {
      return internalProximity
    },
    get mode() {
      return internalMode
    },
    container,
    connect,
    disconnect,
    subscribeToProximityUpdates,
    subscribeToGestureUpdates,
    setToGestureMode,
    setToProximityMode,
    setPollingInterval
  }
}

const getConnectedKanoMotionDetectorKits = () => SerialPort.list().then(ports => {
  console.log('SerialPortList!', ports)
  const kanoMotionDetectorVendorID = '2341'
  const kanoMotionDetectorProductID = '814e'
  const foundDevices = ports.filter(({ vendorId, productId }) => {
    const isExpectedVendorId = vendorId === kanoMotionDetectorVendorID
    const isExpectedProductId = productId === kanoMotionDetectorProductID
    const isMotionDetector = isExpectedVendorId && isExpectedProductId
    return isMotionDetector
  })
  return foundDevices
})

export const makeUSBDeviceTray = ({
  x,
  y,
  name = 'unnamed USB Device Tray',
  universe
}) => {
  const connectedDevicesToImplementationsMap = new Map()

  const usbPlate = makePlate({
    x,
    y,
    width: 100,
    height: 100
  })

  const setupProximityDetectors = async () => {
    const VendorID = 9025
    const ProductID = 33102

    const setupProximityDetector = async device => {
      console.log('Hello Device', device)
      // getConnectedKanoMotionDetectorKits().then(kanoDevices => {
      //   let deviceIndex = 0
      //   for (const kanoDevice of kanoDevices) {
      //     const { path } = kanoDevice
      //     const sensor = makeMotionSensor({
      //       x: 10,
      //       y: 30 * deviceIndex,
      //       path,
      //       universe
      //     })
      //     plate.addChild(sensor.container)
      //     connectedDevicesToImplementationsMap.set(device.locationId, () => {
      //       sensor.disconnect()
      //       plate.remove(sensor.container)
      //     })
      //     sensor.connect().then(() => {
      //       console.log('Connected!')
      //       sensor.setPollingInterval(50).then(() => {
      //         console.log('Interval Set!')
      //       })
      //       sensor.setToProximityMode().then(() => {
      //         console.log('Proximity Mode Set!')
      //       })
      //     })
      //     deviceIndex++
      //   }
      // })
      const detectedDevices = await getConnectedKanoMotionDetectorKits()
      const devicePromises = detectedDevices.map((detectedDevice, index) => {
        const { path } = detectedDevice
        return makeMotionSensor({
          x: 10,
          y: 30 * index,
          path,
          universe
        })
      })
      const sensors = await Promise.all(devicePromises)
      for (const sensor of sensors) {
        sensor.connect().then(() => {
          return Promise.all([
            sensor.setToProximityMode(),
            sensor.setPollingInterval(50)
          ])
        }).then(() => {
          usbPlate.addChild(sensor.container)
        })
      }
    }

    const disableProximityDetector = device => {
      console.log('Goodbye Device:', device)
      if (connectedDevicesToImplementationsMap.has(device.locationId)) {
        const implementationToRemove = connectedDevicesToImplementationsMap.get(device.locationId)
        implementationToRemove.disconnect()
        connectedDevicesToImplementationsMap.delete(device.locationId)
      }
    }

    usbDetect.on(`add:${VendorID}:${ProductID}`, device => {
      setTimeout(() => {
        setupProximityDetector(device)
      }, 2000)
    })

    usbDetect.on(`remove:${VendorID}:${ProductID}`, device => {
      disableProximityDetector(device)
    })

    usbDetect.find(VendorID, ProductID).then(motionSensors => {
      for (const device of motionSensors) {
        setupProximityDetector(device)
      }
    })
  }

  usbPlate.container.on('added', () => {
    usbDetect.startMonitoring()
    // usbDetect.find().then(devices => {
    //   console.log('DEVICES:', devices)
    // })
    setupProximityDetectors()
  })

  usbPlate.container.on('removed', () => {
    usbDetect.stopMonitoring()
  })

  const { container } = usbPlate

  return {
    container
  }
}
