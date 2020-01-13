import { makePlate } from '../Parts/makePlate.js'
import { makeJack } from '../Anatomy/makeJack.js'
import { makeRect } from '../Utilities/makeRect.js'
import { getGlobalAudioContext } from './getGlobalAudioContext.js'
import { connectorValidator } from './validators/connectorValidator.js'

const context = getGlobalAudioContext()

const calculateNotes = () => {
  const letters = [
    'C',
    null,
    'D',
    null,
    'E',
    'F',
    null,
    'G',
    null,
    'A',
    null,
    'B'
  ]
  const output = []
  let octave = -1
  // hz algo swiped from: https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
  const hz = n => 440 * Math.pow(2, (n - 69) / 12)
  const name = n => {
    const index = n % letters.length
    const letter = letters[index]
    if (!letter) {
      const flat = letters[index - 1]
      const sharp = letters[index + 1]
      return {
        isAccidental: true,
        letter: `${flat}b / ${sharp}#`
      }
    } else {
      return {
        isAccidental: false,
        letter: `${letter}`
      }
    }
  }
  let lastLetter = null
  // Did you know there are 128 keys on a MIDI Keyboard?
  for (let i = 0; i < 128; i++) {
    const { letter, isAccidental } = name(i)
    const frequency = hz(i)
    if (lastLetter === 'B') {
      octave++
    }
    output.push({
      midiNote: i,
      name: letter,
      isAccidental,
      frequency,
      octave
    })
    lastLetter = letter
  }
  return output
}

const calculatedNotes = calculateNotes()

export const makeMIDIDeviceTray = ({
  x,
  y,
  name = 'unnamed MIDI Device Tray',
  universe
}) => {
  const plate = makePlate({
    x,
    y,
    width: 100,
    height: 300,
    tint: 0x995588
  })

  const IS_MIDI_SUPPORTED = !!navigator.requestMIDIAccess

  let midiAccess = null

  const { container } = plate

  const requestMidiButton = makeRect({
    x: 8,
    y: 8,
    width: 32,
    height: 32,
    tint: 0xff88ff,
    interactive: true
  })

  const midiSupportedIndicator = makeRect({
    x: 44,
    y: 8,
    width: 8,
    height: 8,
    tint: 0xff0000,
    interactive: false
  })

  const midiAccessGranted = makeRect({
    x: 54,
    y: 8,
    width: 8,
    height: 8,
    tint: 0xff0000,
    interactive: false
  })

  const renderedItems = new Set()

  if (IS_MIDI_SUPPORTED) {
    midiSupportedIndicator.tint = 0x00ff00
  }

  const clearEverything = () => {
    for (const renderedItem of renderedItems) {
      container.removeChild(renderedItem)
    }
  }

  const renderInputs = inputs => {
    const renderInput = (input, index) => {
      const commonGainNode = context.createGain()
      const activeNotes = new Map()

      const noteDown = ({ midiNote }) => {
        const osc = context.createOscillator()
        const { frequency } = calculatedNotes[midiNote]
        osc.frequency.setValueAtTime(frequency, context.currentTime)
        osc.connect(commonGainNode)
        osc.start()
        activeNotes.set(midiNote, osc)
      }

      const noteUp = ({ midiNote }) => {
        const osc = activeNotes.get(midiNote)
        activeNotes.delete(midiNote)
        osc.stop()
      }

      makeJack({
        x: 8,
        y: 48 + (index * 20),
        name: `[${name}]'s ${input.id} midiJack`,
        themeImage: 'jackConnector',
        universe,
        get node () {
          return commonGainNode
        },
        connectionValidator ({ jack, selfJack, ...rest }) {
          return connectorValidator({ jack, selfJack, ...rest })
        },
        onConnect ({ jack }) {
          console.log('connectJack', jack)
          commonGainNode.connect(jack.node)
        },
        onDisconnect ({ jack }) {
          console.log('disconnectJack', jack)
          commonGainNode.disconnect(jack.node)
        }
      }).then(midiJack => {
        console.log({ input })
        input.onmidimessage = event => {
          const { data } = event
          const [id, partA, partB] = data
          if (id === 128) {
            // console.log('Note Off')
          } else if (id === 144) {
            // console.log('Note On')
            const midiNote = partA
            const velocity = partB
            if (velocity > 0) {
              noteDown({ midiNote })
            } else {
              noteUp({ midiNote })
            }
          } else if (id === 176) {
            console.log('Controller')
          } else {
            console.log({ data })
          }
        }

        renderedItems.add(midiJack.container)
        container.addChild(midiJack.container)
      })
    }
    let index = 0
    for (const input of inputs) {
      renderInput(input, index)
      index++
    }
  }

  const renderOutputs = outputs => {
    for (const output of outputs) {
      console.log({ output })
    }
  }

  const requestPermissionForMIDIAccess = () => {
    // because we are talking about Electron / Chrome, this will work.
    clearEverything()
    if (IS_MIDI_SUPPORTED) {
      midiAccessGranted.tint = 0xffff00
      navigator.requestMIDIAccess()
        .then(function (access) {
          // Get lists of available MIDI controllers
          const inputs = access.inputs.values()
          const outputs = access.outputs.values()

          midiAccess = access

          console.log(access)

          renderInputs(inputs)
          renderOutputs(outputs)

          midiAccessGranted.tint = 0x00ff00

          access.onstatechange = function (e) {
            // Print information about the (dis)connected MIDI controller
            const { port } = e
            console.log({ port })
            console.log(e.port.name, e.port.manufacturer, e.port.state)
          }
        }).catch(() => {
          midiAccessGranted.tint = 0xff0000
        })
    } else {
      midiAccessGranted.tint = 0xff0000
      console.error('ERROR - MIDI is not supported using the current browser.')
      console.info('CanIUse: http://webaudio.github.io/web-midi-api/')
    }
  }

  requestPermissionForMIDIAccess()

  container.addChild(
    requestMidiButton,
    midiSupportedIndicator,
    midiAccessGranted
  )

  requestMidiButton.on('pointerdown', () => {
    requestPermissionForMIDIAccess()
  })

  return {
    container
  }
}
