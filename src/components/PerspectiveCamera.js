import React from 'react'
import * as THREE from 'three'
import { withSceneContext } from 'components/Scene'
import { withRendererContext } from 'components/Renderer'
import flow from 'lodash/flow'

const CameraContext = React.createContext({})

export const withCameraContext = Component => props => {
  return (
    <CameraContext.Consumer>
      {(context) => <Component {...props} {...context} />}
    </CameraContext.Consumer>
  )
}

class Camera extends React.PureComponent {
  state = {
    frame: 0
  }
  componentDidMount() {
    const { scene, width, height, fov, near, far, position, quaternion } = this.props
    this._camera = new THREE.PerspectiveCamera(fov, width/height, near, far)
    this._camera.position.copy(position)
    this._camera.quaternion.copy(quaternion)
    scene.setCamera(this._camera)
    this.setState({ fov, camera: this._camera })
  }
  componentWillReceiveProps({ renderScenes, scene, width, height, fov, near, far, position, quaternion }) {
    let changed = false
    if(this.props.fov !== fov) {
      this._camera.fov = fov
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.near !== near) {
      this._camera.near = near
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.width !== width || this.props.height !== height) {
      this._camera.aspect = width/height
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.far !== far) {
      this._camera.far = far
      this._camera.updateProjectionMatrix()
      changed = true
    }
    if(this.props.position !== position) {
      this._camera.position.copy(position)
      changed = true
    }
    if(this.props.quaternion !== quaternion) {
      this._camera.quaternion.copy(quaternion)
      changed = true
    }
    if(changed) {
      renderScenes()
      this.setState({ fov, frame: this.state.frame+1 })
    }
  }
  render() {
    const { children } = this.props
    const { camera } = this.state
    return (
      <CameraContext.Provider value={this.state}>
        {camera && children}
      </CameraContext.Provider>
    )
  }
}
Camera.defaultProps = {
  fov: 75,
  near: 0.1,
  far: 50,
  position: new THREE.Vector3(0, 0, 0),
  quaternion: new THREE.Quaternion()
}
export default flow(
  withSceneContext,
  withRendererContext
)(Camera)
