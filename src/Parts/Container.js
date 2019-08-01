import React from 'react'
import styled from 'styled-components'

const StylishContainer = styled.div`
  display: flex;
  width: 100%;
`

export const Container = ({ children, className }) => {
  return (
    <StylishContainer className={className}>{ children }</StylishContainer>
  )
}
