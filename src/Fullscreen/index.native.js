import React from 'react'
import { StatusBar, Dimensions } from 'react-native'
import styled from 'styled-components'

const Container = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: hidden;
`
export default class FullscreenStage extends React.PureComponent {
  state = {}
  onResize = () => {
    this.updateSize()
  }
  updateSize = () => {
    const { height, width } = Dimensions.get('window')
    this.setState({ width, height })
  }
  componentDidMount() {
    Dimensions.addEventListener('change', this.onResize)
    this.updateSize()
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onResize)
  }
  render() {
    const { width, height } = this.state
    const { children } = this.props
    if(!width || !height) return false
    return (
      <Container>
        { children && children(this.state) }
      </Container>
    )
  }
}


