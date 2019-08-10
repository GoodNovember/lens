import React from 'react'
import { FullContainer } from '../Parts/FullContainer'
import { ThreeScene } from '../Parts/ThreeScene'

import * as THREE from 'three'

export const ThreeLayout = ({ children, className }) => {
  const boot = ({ scene, renderer, camera }) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 5
    const animate = ts => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.1
      cube.rotation.y += 0.1
    }
    requestAnimationFrame(animate)
  }

  return (
    <FullContainer className='root-layout'>
      <ThreeScene onBoot={boot} />
    </FullContainer>
  )
}
