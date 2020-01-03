const EventEmitter = require('events')
const uuid = require('uuid')
const SerialPort = require('serialport')
const { createInterface } = require('readline')

export const makeRPCClient = () => {
  const request = ({ method, params }) => {
    const id = uuid.v4()
    const payload = {
      type: 'rpc-request',
      id,
      method,
      params
    }
  }

  return {

  }
}
