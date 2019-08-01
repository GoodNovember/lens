import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { AppRoot } from './AppRoot.jsx'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { theme } from './theme.js'

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  }
  body{
    margin:0;
  }
`

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Fragment>
      <GlobalStyle />
      <AppRoot />
    </Fragment>
  </ThemeProvider>
  , document.getElementById('root'))
