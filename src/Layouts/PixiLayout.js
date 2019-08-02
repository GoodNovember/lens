import React from 'react'
import { FullContainer } from '../Parts/FullContainer'
import { PixiScene } from '../Parts/PixiScene'
import { boot } from '../PixiStuff/boot'
export const PixiLayout = () => {
  return (
    <FullContainer className='pixi-layout'>
      <PixiScene onBoot={boot} />
    </FullContainer>
  )
}
