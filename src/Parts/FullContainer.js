import React from 'react'
import styled from 'styled-components'

const StylishFullContainer = styled.div`
  display: flex;
  height: 100vh;
`

export const FullContainer = ({ children, className }) => {
  return (
    <StylishFullContainer className={className}>{ children }</StylishFullContainer>
  )
}
