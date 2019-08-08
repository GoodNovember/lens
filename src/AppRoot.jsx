import React from 'react'
import { BabylonLayout } from './Layouts/BabylonLayout'
import { RootLayout } from './Layouts/RootLayout'
import { PixiLayout } from './Layouts/PixiLayout'
import { ThreeLayout } from './Layouts/ThreeLayout'
export const AppRoot = () => {
  return (
    <div>
      {/* <PixiLayout /> */}
      <ThreeLayout />
    </div>
  )
}
