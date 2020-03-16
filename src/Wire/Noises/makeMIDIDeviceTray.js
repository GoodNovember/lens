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

  const midiRequestButton = makeRect({
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
      plate.removeChild(renderedItem)
    }
  }

  const playNote = ({
    frequency = 440,
    attack = 0,
    release = 0,
    start = 0,
    stop = 0,
    velocity = 1,
    attackShape = 'linear',
    releaseShape = 'linear'
  }) => {
    const osc = context.createOscillator()
    const now = context.currentTime
    osc.frequency.value = frequency
    const oscGain = context.createGain()
    osc.connect(oscGain)
    osc.start(start)
    if (attack > 0) {
      oscGain.gain.value = 0
      if (attackShape === 'linear') {
        oscGain.gain.linearRampToValueAtTime(1 * velocity, now + start + (attack * velocity))
      }
      if (attackShape === 'exponential') {
        oscGain.gain.exponentialRampToValueAtTime(1 * velocity, now + start + (attack * velocity))
      }
    } else {
      oscGain.gain.value = 0
      oscGain.gain.value = 1 * velocity
    }

    const stopNote = () => {
      const now = context.currentTime
      const stopTime = now + stop + release
      const stopValue = 0.0000001
      oscGain.gain.setValueAtTime(oscGain.gain.value, context.currentTime)
      osc.stop(stopTime)
      if (release > 0) {
        if (releaseShape === 'linear') {
          oscGain.gain.linearRampToValueAtTime(stopValue, stopTime)
        }
        if (releaseShape === 'exponential') {
          oscGain.gain.exponentialRampToValueAtTime(stopValue, stopTime)
        }
      }
    }

    return {
      oscGain,
      stopNote
    }
  }

  const renderInputs = inputs => {
    const renderInput = ({ input, index }) => {
      const commonGainNode = context.createGain()
      const activeNotes = new Map()

      const defaultNoteDown = ({ midiNote, velocity }) => {
        const { frequency } = calculatedNotes[midiNote]
        const { oscGain, stopNote, onStopped } = playNote({
          frequency,
          velocity,
          // attack: 0.00
          release: 0.05,
          releaseShape: 'exponential'
        })
        oscGain.connect(commonGainNode)
        activeNotes.set(midiNote, { stopNote, oscGain, onStopped })
      }

      const noteUp = ({ midiNote }) => {
        if (activeNotes.has(midiNote)) {
          const { stopNote } = activeNotes.get(midiNote)
          stopNote()
        }
      }

      const ancient_noteUp = ({ midiNote }) => {
        const { osc, oscGain } = activeNotes.get(midiNote)
        activeNotes.delete(midiNote)

        // SEE: http://alemangui.github.io/blog//2015/12/26/ramp-to-value.html

        // LORE
        // turns out if you stop a sound immedately, it returns an audible 'click'.
        // This is because you sliced off part of the smoothness of what the osc generates
        // It stops(0) as soon as it possibly can without going further.

        // To make it more plesant to listen to, we can fade the oscillator out rather quickly, but not instantly.

        // Perhaps, this simulates turning down a mixer fader super quick vs. pulling the plug on the speaker.

        // TLDR: Doing all this it makes things sound nicer when it stops.

        oscGain.gain.setValueAtTime(1.0, context.currentTime)
        oscGain.gain.linearRampToValueAtTime(0.0001, context.currentTime + 0.03)
        // oscGain.gain.exponentialRampToValueAtTime(0.00000001, context.currentTime + 0.03)
        osc.stop(context.currentTime + 0.03)
      }

      makeJack({
        x: 8,
        y: 48 + (index * 20),
        name: `[${name}]'s ${input.id} midiJack`,
        themeImage: 'jackConnector',
        universe,
        get node() {
          return commonGainNode
        },
        connectionValidator({ jack, selfJack, ...rest }) {
          return connectorValidator({ jack, selfJack, ...rest })
        },
        onConnect({ jack }) {
          console.log('connectJack', jack)
          commonGainNode.connect(jack.node)
        },
        onDisconnect({ jack }) {
          console.log('disconnectJack', jack)
          try {
            commonGainNode.disconnect(jack.node)
          } catch (error) {
            if (error.code === 15) {
              console.log('Already Disconnected.')
            } else {
              console.error('disconnectJack Error', { jack, error })
            }
          }
        }
      }).then(midiJack => {
        console.log({ input })
        input.onmidimessage = event => {
          const { data } = event
          const [id, partA, partB] = data
          const dataLength = data.length
          if (id === 128) {
            console.log('Note Off')
          } else if (id === 144) {
            // console.log('Note On')
            const midiNote = partA
            const velocity = partB / 127
            // console.log(data)
            if (velocity > 0) {
              defaultNoteDown({ midiNote, velocity })
            } else {
              // ancient_noteUp({ midiNote })
              noteUp({ midiNote })
            }
          } else if (id === 176) {
            console.log('Controller')
          } else if (id === 248) {
            // console.log('MIDI Beat Clock')
            // console.count('tick')
            // console.log({ data })
          } else {
            if (dataLength === 1) {
              // skip the single note things for now. -- <3 Victor
              // console.log('boop')
            } else {
              console.log({ data })
            }
          }
        }

        renderedItems.add(midiJack.container)
        plate.addChild(midiJack.container)
      })
    }
    let index = 0
    for (const input of inputs) {
      renderInput({ input, index })
      index++
    }
  }

  const renderOutputs = outputs => {
    const renderOutput = ({ output, index }) => {
      if (output.name === 'Launchpad Mini') {
        // output.send([176, 0, 1]) // switch to 'X-Y Layout (default)'
        output.send([176, 0, 2]) // switch to 'Drum rack layout'

        // output.send([176, 0, 127]) // full bright test
        // output.send([176, 0, 126]) // medium bright test
        // output.send([176, 0, 125]) // low bright test
      }
      console.log({ output })
    }
    let index = 0
    for (const output of outputs) {
      renderOutput({ output, index })
      index++
    }
  }

  const renderIO = ({ inputs, outputs }) => {
    renderInputs(inputs)
    renderOutputs(outputs)
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

          renderIO({
            inputs,
            outputs
          })

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

  requestPermissionForMIDIAccess() // we humbly ask on load.

  container.addChild(
    midiRequestButton,
    midiSupportedIndicator,
    midiAccessGranted
  )

  midiRequestButton.on('pointerdown', () => {
    requestPermissionForMIDIAccess()
  })

  return {
    container
  }
}
