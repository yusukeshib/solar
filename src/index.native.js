import React from 'react'
import { registerRootComponent } from 'expo'
import App from './App'
import { THREE } from 'expo-three'
import styled from 'styled-components'
import { DefaultTheme as light, DarkTheme as dark, Provider as PaperProvider } from 'react-native-paper'

THREE.suppressExpoWarnings()

const theme = {
  ...dark,
  colors: {
    ...dark.colors,
    primary: '#000a12',
    accent: '#1565c0'
  }
};
const Container = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: black;
`

const Root = props => (
  <PaperProvider theme={theme}>
    <Container>
      <App/>
    </Container>
  </PaperProvider>
)

registerRootComponent(Root)

