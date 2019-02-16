import React from 'react'
import { findDOMNode } from 'react-dom'
import * as THREE from 'three'
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
  componentDidMount() {
    const { width, height } = this.props
    // renderer
    const canvas = findDOMNode(this)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      canvas,
      logarithmicDepthBuffer: true,
    })
    renderer.setSize(width, height)
    renderer.autoClear = false
    renderer.setPixelRatio(window.devicePixelRatio)
    this.setState({ renderer, width, height })
  }
  componentWillReceiveProps(nextProps) { 
    const { renderer } = this.state
    const { width, height } = nextProps
    if(width !== this.props.width || height !== this.props.height) {
      renderer.setSize(width, height)
      this.setState({ width, height })
    }
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
    renderer.clear()
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
        <canvas width={width} height={height} />
        <RendererContext.Provider value={{ width, height, ...this.state }}>
          { this.state.renderer && children }
        </RendererContext.Provider>
      </React.Fragment>
    )
  }
}
