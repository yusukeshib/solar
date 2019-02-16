import React from 'react'
import ExpoTHREE, { THREE } from 'expo-three'
import { View as GraphicsView } from 'expo-graphics'
import throttle from 'lodash/throttle'

const RendererContext = React.createContext({})

export const withRendererContext = Component => props => {
  return (
    <RendererContext.Consumer>
      {(context) => <Component {...props} {...context} />}
    </RendererContext.Consumer>
  )
}

export default class Renderer extends React.PureComponent {
  scenes = []
  onContextCreate = async ({
    gl,
    canvas,
    scale: pixelRatio,
  }) => {
    const { width, height } = this.props
    // renderer
    const renderer = new ExpoTHREE.Renderer({
      gl,
      canvas,
      width,
      height,
      pixelRatio,
      preserveDrawingBuffer: true,
      logarithmicDepthBuffer: true,
    })
    renderer.setSize(width, height)
    renderer.autoClear = false
    this.setState({ pixelRatio, renderer, width, height })
  }
  componentWillReceiveProps(nextProps) { 
    const { renderer } = this.props
    const { width, height } = nextProps
    if(width !== this.props.width || height !== this.props.height) {
      renderer.setSize(width, height)
      this.setState({ width, height })
    }
  }
  onResize = ({ width, height, scale }) => {
    // console.log('resize:', { width, height, scale })
  }
  onRender = delta => {
    // this.renderScene()
  }
  addScene = (scene) => {
    this.scenes.push(scene)
  }
  removeScene = (scene) => {
    const index = this.scenes.indexOf(scene)
    this.scenes.splice(index, 1)
  }
  renderScenes = () => {
    const { renderer } = this.state
    // renderer.clear()
    for(let scene of this.scenes) {
      scene.renderScene()
    }
  }
  state = {
    addScene: this.addScene,
    removeScene: this.removeScene,
    renderScenes: throttle(this.renderScenes, 60/1000, { heading: false })
  }
  render() {
    const { width, height, children, ...props } = this.props
    if(!width || !height) return false
    return (
      <React.Fragment>
        <GraphicsView
          style={{ width, height }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
        />
        <RendererContext.Provider value={this.state}>
          { this.state.renderer && children }
        </RendererContext.Provider>
      </React.Fragment>
    )
  }
}
