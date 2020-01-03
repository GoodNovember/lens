/* globals location */
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Impetus from '../Foreign/Impetus.js'

import { PIXI } from '../Wire/Utilities/localPIXI.js'

import { updatePhysics } from '../Wire/Verlet/engine.js' // added canvas 2d support.
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
    const impetusListeners = new Set()
    // document.addEventListener('keypress', function (e) {
    //   const { charCode } = e
    //   // switch (charCode) {
    //   //   case 13: {
    //   //     toggleFullscreen()
    //   //     break
    //   //   }
    //   //   case 0: {
    //   //     toggleFullscreen()
    //   //     break
    //   //   }
    //   //   case 32: {
    //   //     // console.log('Refresh')
    //   //     location.reload()
    //   //     break
    //   //   }
    //     // default: {
    //       // console.log(`charCode:${charCode}`)
    //       // console.log(e)
    //     // }
    //   // }
    // }, false)

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

    const subscribeToImpetus = callback => {
      if (impetusListeners.has(callback) === false) {
        impetusListeners.add(callback)
      }
      return () => {
        if (impetusInstance.has(callback)) {
          impetusListeners.delete(callback)
        }
      }
    }

    let impetusInstance = null

    if (canvasRef.current) {
      impetusInstance = new Impetus({
        sounce: canvasRef.current,
        friction: 0.94,
        update: (x, y) => {
          impetusListeners.forEach(listener => listener({ x, y }))
        }
      })
      const { current: view } = canvasRef
      const App = new Application({ view, ...appOptions })
      App.stage = new PIXI.display.Stage()
      App.stage.sortableChildren = true
      App.ticker.add((deltaTime) => {
        if (canvasRef.current) {
          const targetWidth = view.clientWidth * getDPR()
          const targetHeight = view.clientHeight * getDPR()
          if ((view.width !== targetWidth) || (view.height !== targetHeight)) {
            App.renderer.resize(targetWidth, targetHeight)
            resizeListeners.forEach(listener => listener({ width: targetWidth, height: targetHeight }))
          }
          updatePhysics({
            deltaTime
          })
        }
      })
      if (typeof onBoot === 'function') {
        onBoot({
          App,
          view,
          subscribeToResize,
          subscribeToImpetus
        })
      }
    }

    return () => {
      if (impetusInstance) {
        impetusInstance.destroy()
      }
      impetusListeners.clear()
      resizeListeners.clear()
    }
  }, [])

  return (
    <StylishCanvas ref={canvasRef} />
  )
}
