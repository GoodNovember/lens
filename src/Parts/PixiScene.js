/* globals location */
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import * as PIXI from 'pixi.js'
// import { app } from 'electron'
global.PIXI = PIXI
require('pixi-layers')

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
    const resizeListeners = new Set()
    document.addEventListener('keypress', function (e) {
      const { charCode } = e
      switch (charCode) {
        case 13: {
          toggleFullscreen()
          break
        }
        case 0: {
          toggleFullscreen()
          break
        }
        case 32: {
          console.log('Refresh')
          location.reload()
          break
        }
        default: {
          console.log(`charCode:${charCode}`)
          console.log(e)
        }
      }
    }, false)

    const subscribeToResize = callback => {
      if (resizeListeners.has(callback) === false) {
        resizeListeners.add(callback)
      }
      return () => {
        if (resizeListeners.has(callback)) {
          resizeListeners.delete(callback)
        }
      }
    }

    if (canvasRef.current) {
      const { current: view } = canvasRef
      const App = new Application({ view, ...appOptions })
      App.stage = new PIXI.display.Stage()
      App.stage.sortableChildren = true
      App.ticker.add(() => {
        if (canvasRef.current) {
          const targetWidth = view.clientWidth * getDPR()
          const targetHeight = view.clientHeight * getDPR()
          if ((view.width !== targetWidth) || (view.height !== targetHeight)) {
            App.renderer.resize(targetWidth, targetHeight)
            resizeListeners.forEach(listener => listener({ width: targetWidth, height: targetHeight }))
          }
        }
      })
      if (typeof onBoot === 'function') {
        onBoot({ App, view, subscribeToResize })
      }
    }

    return () => {
      resizeListeners.clear()
    }

  }, [])

  return (
    <StylishCanvas ref={canvasRef} />
  )
}
