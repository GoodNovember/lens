# Gain

This node takes in an audio signal and raises or lowers its volume.

## I/O

Input Count: `1`
Output Count: `1`

## Channels
- Count: `2`
- Mode: `max`
- Interpretation: `speakers`

## AudioParams

- `gainNode.gain`
  - automationRate: `a-rate`
  - max: `3.4028234663852886e+38`
  - min: `-3.4028234663852886e+38`
  - default: `1`
  - Notes: if `gainNode.gain.value` is changed directly, the gain is INSTANTLY changed to the value. This can be aesthetically noisy and glitchy sounding so using the `gainNode.gain.setValueAtTime(value, audioCtx.currentTime + delay)` might sound nicer. Unless you like the glitches.

# Oscillator

This node creates repeating waveforms of a given shape. It has several built-in shapes, but it can also be customized.

The actual dimensions of the shapes are also completely cusomizable at preformance time.

## I/O

This is classified as a Source node as it has no inputs and just the one output.

- Input count: `0` 
- Output count: `1`

## Important Methods

- `oscillatorNode.setPeroidicWave(customWave)`
  - see PeriodicWave
  - calling this automatically sets the `type` to `custom`.

## Important Properties

- `oscillatorNode.type`
  - type: `string`
  - validValues:
    - `sine` (default)
      - wiki: https://en.wikipedia.org/wiki/Sine_wave
    - `square`
      - wiki: https://en.wikipedia.org/wiki/Square_wave
    - `sawtooth`
      - wiki: https://en.wikipedia.org/wiki/Sawtooth_wave
    - `triangle`
      - wiki: https://en.wikipedia.org/wiki/Triangle_wave
    - `custom`
      - see: PeriodicWave

## Audio Params

- `oscillatorNode.frequency`
  - automationRate: `a-rate`
  - max: `22050`
  - min: `-22050`
  - default: `440` (`440hz` is a standard middle-A note)
  - unit: `hertz` or `hz`
  - Notes:
    - A sets this oscilator's base tone, in `hz`. 
    - Goes well beyond what is comfortable to listen to. 
    - The positive and negative values represent inverses or mirrors of eachother, if you want to create the inverse of the shape you have you can multiply the `value` by `-1`.
- `oscillatorNode.detune`
  - automationRate: `a-rate`
  - max: `153600`
  - min: `-153600`
  - default: `0` (no change in frequency)
  - unit: `cents`
  - Notes: 
    - Represents a detuning of the oscillator's `frequency` in `cents`.
  - Wiki: https://en.wikipedia.org/wiki/Cent_%28music%29
