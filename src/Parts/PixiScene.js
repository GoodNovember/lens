import React, { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import styled from 'styled-components'
import "pixi-layers"

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

  const toggleFullscreen = () => {
    if (canvasRef.current) {
      if (!document.fullscreenElement) {
        console.log('Entering Fullscreen')
        canvasRef.current.requestFullscreen()
      } else if (document.exitFullscreen) {
        console.log('Exiting Fullscreen')
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keypress", function (e) {
      const { charCode } = e
      switch (charCode) {
        case 13: {
          toggleFullscreen()
          break
        }
        case 0: {
          toggleFullScreen()
          break
        }
        case 32: {
          console.log("Refresh")
          location.reload()
          break
        }
        default: {
          console.log(`charCode:${charCode}`)
          console.log(e)
        }
      }
    
    }, false)

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
