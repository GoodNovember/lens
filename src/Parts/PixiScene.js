import React, { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import styled from 'styled-components'

const getDPR = () => window.devicePixelRatio || 1.0

const StylishCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
`

const { Application } = PIXI

export const PixiScene = ({ onBoot, appOptions }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      const { current: view } = canvasRef
      const App = new Application({ view, ...appOptions })
      App.ticker.add(() => {
        if (canvasRef.current) {
          const targetWidth = view.clientWidth * getDPR()
          const targetHeight = view.clientHeight * getDPR()
          if ((view.width !== targetWidth) || (view.height !== targetHeight)) {
            App.renderer.resize(targetWidth, targetHeight)
          }
        }
      })
      if (typeof onBoot === 'function') {
        onBoot({ App, view })
      }
    }
  }, [])

  return (
    <StylishCanvas ref={canvasRef} />
  )
}
