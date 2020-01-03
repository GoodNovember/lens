import { useEffect } from 'react'
const usbDetect = require('usb-detection')

export const useUSB = () => {
  useEffect(() => {
    usbDetect.startMonitoring()
    return () => {
      usbDetect.stopMonitoring()
    }
  })
  return usbDetect
}
