/* globals requestAnimationFrame */
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styled from 'styled-components'

require('pixi-layers')

const getDPR = () => window.devicePixelRatio || 1.0

const StylishCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
`

export const ThreeScene = ({ onBoot, cameraOptions = {
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000
} }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      let canRender = true

      const canvas = canvasRef.current
      const renderer = new THREE.WebGLRenderer({ canvas })
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        cameraOptions.fov,
        cameraOptions.aspect,
        cameraOptions.near,
        cameraOptions.far
      )

      const sizer = () => {
        const targetWidth = canvas.clientWidth
        const targetHeight = canvas.clientHeight
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          renderer.setSize(targetWidth, targetHeight, false)
          camera.aspect = targetWidth / targetHeight
          camera.updateProjectionMatrix()
        }
      }

      const heartbeat = (ts) => {
        if (canRender) {
          sizer()
          requestAnimationFrame(heartbeat)
          renderer.render(scene, camera)
        }
      }

      requestAnimationFrame(heartbeat)

      if (typeof onBoot === 'function') {
        onBoot({ scene, camera, renderer })
      }

      return function cleanup () {
        canRender = false
      }
    }
  }, [])

  return (
    <StylishCanvas ref={canvasRef} />
  )
}
