import React from 'react'
import styled from 'styled-components'

const StylishScrollContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-y: scroll;
`

export const ScrollContainer = ({ children, className, ...props }) => {
  return (
    <StylishScrollContainer className={className} {...props}>{ children }</StylishScrollContainer>
  )
}
