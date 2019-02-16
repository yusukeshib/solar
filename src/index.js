import '@babel/polyfill'
import App from './App'
import React from 'react'
import { render } from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createGlobalStyle } from 'styled-components'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const light = createMuiTheme({
  typography: {
    useNextVariants: true
  }
})

const dark = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: 'dark'
  }
})

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons')
`
render(
  <React.Fragment>
    <GlobalStyle/>
    <MuiThemeProvider theme={dark}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  </React.Fragment>
  , document.getElementById('root'))

