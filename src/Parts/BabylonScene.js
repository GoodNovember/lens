import React, {
  useRef,
  useEffect
} from 'react'

import styled from 'styled-components'
import * as BABYLON from 'babylonjs'

const {
  Scene,
  Engine
} = BABYLON

const StylishCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
`

export const BabylonScene = ({
  engineOptions,
  adaptToDeviceRatio,
  onBoot
}) => {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (canvasRef.current) {
      const engine = new Engine(
        canvasRef.current,
        true,
        engineOptions,
        adaptToDeviceRatio
      )
      const scene = new Scene(engine)
      if (typeof onBoot === 'function') {
        onBoot({ engine, scene, canvas: canvasRef.current })
      }
    }
  }, [])
  return (
    <StylishCanvas ref={canvasRef} />
  )
}
