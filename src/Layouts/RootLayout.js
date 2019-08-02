import React, { useState } from 'react'
import { FullContainer } from '../Parts/FullContainer'
import { BabylonScene } from '../Parts/BabylonScene'
import { Container } from '../Parts/Container'
import { ScrollContainer } from '../Parts/ScrollContainer'

import * as BABYLON from 'babylonjs'
import * as GUI from 'babylonjs-gui'

const {
  UniversalCamera,
  Vector3,
  HemisphericLight,
  Mesh
} = BABYLON

export const RootLayout = ({ children, className }) => {
  const [buttonState, setButtonState] = useState('Init')

  const onBootHandler = ({ engine, scene, canvas }) => {
    const camera = new UniversalCamera('camera1', new Vector3(0, 5, -10), scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, true)

    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    const sphere = Mesh.CreateSphere('sphere1', 16, 2, scene)
    sphere.position.y = 1

    const ground = Mesh.CreateGround('ground1', 6, 6, 2, scene)
    ground.position.y = 0

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
    const button = GUI.Button.CreateSimpleButton('but', 'Click Me')
    button.width = '100px'
    button.height = '40px'
    button.color = 'white'
    button.background = 'green'
    button.onPointerDownObservable.add(() => {
      setButtonState('DOWN')
    })
    button.onPointerUpObservable.add(() => {
      setButtonState('UP')
    })
    button.onPointerMoveObservable.add((coordinates) => {
      const relative = button.getLocalCoordinates(coordinates)
      setButtonState(`${relative.x} ${relative.y} \n${coordinates.x} ${coordinates.y}`)
    })

    advancedTexture.addControl(button)

    engine.runRenderLoop(() => {
      if (scene) {
        scene.render()
      }
    })
  }
  return (
    <FullContainer className='root-layout'>
      <ScrollContainer>
        <pre>
          { buttonState }
        </pre>
      </ScrollContainer>
      <Container>
        <BabylonScene onBoot={onBootHandler} />
      </Container>
    </FullContainer>
  )
}
