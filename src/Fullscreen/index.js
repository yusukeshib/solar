import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: hidden;
`
export default class Fullscreen extends React.PureComponent {
  state = {}
  onResize = () => {
    this.updateSize()
  }
  updateSize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }
  onCreate = (node) => {
    this.updateSize()
  }
  componentDidMount() {
    window.addEventListener('resize', this.onResize)
    this.updateSize()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }
  render() {
    const { width, height } = this.state
    const { children } = this.props
    return (
      <Container ref={this.onCreate}>
        { width && height && children && children(this.state) }
      </Container>
    )
  }
}


